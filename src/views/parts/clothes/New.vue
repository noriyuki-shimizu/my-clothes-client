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
        <clothes-form
            v-on:onSubmit="onSubmit"
            v-on:onErrorHandle="onErrorHandle"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { AppMessage } from 'ant-design-vue/types/message';

import { isAxiosError } from '@/plugins/api';
import ClothesForm from '@/components/clothes/Form.vue';
import { ConvertedFormFields } from '@/components/clothes/form';
import { resetMessage } from '@/util/reset';
import { timeFormat } from '@/util/date';

@Component({
    components: {
        ClothesForm
    }
})
export default class New extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    async onRegister(values: ConvertedFormFields) {
        await this.$store.dispatch('clothes/onAddClothes', values);

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                this.$router.push({ name: 'clothes' });
            }
        });
    }

    @Emit('onErrorHandle')
    onErrorHandle(err: any) {
        this.message = resetMessage();
        if (isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                const { $store, $router } = this;
                this.$warning({
                    title: 'Certification expired',
                    content: 'Please sign in again.',
                    onOk: () => {
                        $store.dispatch('user/signOut');
                        $router.push({
                            name: 'signIn',
                            params: { again: 'again' }
                        });
                    }
                });
                return;
            }

            this.message = {
                isShow: true,
                text: `Error (${err.message})`,
                description: err.response
                    ? err.response.data
                    : `Access URL: ${err.config.url}`,
                type: 'error'
            };
        }
    }

    @Emit('onSubmit')
    async onSubmit(values: ConvertedFormFields) {
        this.$confirm({
            title: 'Are you sure you want to register?',
            content: 'The entered information is registered.',
            onOk: async () => {
                try {
                    await this.onRegister(values);
                } catch (err) {
                    this.onErrorHandle(err);
                }
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
