<template>
    <div>
        <h1>New clothes</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <clothes-form v-on:on-submit="onSubmit" v-on:on-error="onError" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { AppMessage } from 'ant-design-vue/types/message';

import ClothesForm from '@/components/clothes/Form.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { FormFields } from '@/components/clothes/type';

@Component({
    components: {
        ClothesForm
    }
})
export default class New extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    async onRegister(values: FormFields) {
        await this.$store.dispatch('clothes/onAddClothes', values);

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                if (this.$route.query.next === 'back') {
                    this.$router.back();
                    return;
                }
                this.$router.push({ name: 'clothes' });
            }
        });
    }

    @Emit('on-error')
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

    @Emit('on-submit')
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
