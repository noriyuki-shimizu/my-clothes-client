<template>
    <div>
        <h1>New brand</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <brand-form v-on:onSubmit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import BrandForm from '@/components/brand/Form.vue';
import { FormFields } from '@/components/brand/type';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        BrandForm
    }
})
export default class New extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    onError(err: any) {
        this.message = resetMessage();
        handleForbiddenError(err, this.$store, this.$router);

        this.message = {
            isShow: true,
            text: `Error (${err.message})`,
            description: err.response
                ? err.response.data
                : `Access URL: ${err.config.url}`,
            type: 'error'
        };
    }

    async onRegister(values: FormFields) {
        const { name, image, link, country } = values;
        const imageFile = image && image.file ? image.file.originFileObj : null;

        await this.$store.dispatch('brand/onAddBrand', {
            brand: {
                name,
                link,
                country
            },
            imageFile
        });

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                this.$router.push({ name: 'brand' });
            }
        });
    }

    @Emit('onSubmit')
    async onSubmit(values: FormFields) {
        this.$confirm({
            title: 'Are you sure you want to register?',
            content: 'The entered information is registered.',
            onOk: async () => {
                await this.onRegister(values).catch(this.onError);
            },
            onCancel() {}
        });
    }
}
</script>

<style>
.alert-message {
    margin-bottom: 20px;
}
</style>
