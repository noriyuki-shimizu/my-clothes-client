<template>
    <div>
        <h1>New shop</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <shop-form v-on:on-submit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { AppMessage } from 'ant-design-vue/types/message';

import ShopForm from '@/components/shop/Form.vue';
import { ConvertedFormFields } from '@/components/shop/type';
import { resetMessage } from '@/util/reset';
import { timeFormat } from '@/util/date';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        ShopForm
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

    async onRegister(values: ConvertedFormFields) {
        await this.$store.dispatch('shop/onAddShop', {
            ...values
        });

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                this.$router.push({ name: 'shop' });
            }
        });
    }

    @Emit('on-submit')
    async onSubmit(values: ConvertedFormFields) {
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
