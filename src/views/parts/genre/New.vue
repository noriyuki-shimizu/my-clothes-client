<template>
    <div>
        <h1>New genre</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <genre-form v-on:onSubmit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { AppMessage } from 'ant-design-vue/types/message';

import { isAxiosError } from '@/plugins/api';
import GenreForm from '@/components/genre/Form.vue';
import { FormFields } from '@/components/genre/form';
import { resetMessage } from '@/util/reset';

@Component({
    components: {
        GenreForm
    }
})
export default class New extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

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
                        $router.push({ name: 'signIn' });
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

    async onRegister(values: FormFields) {
        const { name, color } = values;

        await this.$store.dispatch('genre/onAddGenre', {
            genre: {
                name,
                color
            }
        });

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                this.$router.push({ name: 'genre' });
            }
        });
    }

    @Emit('onSubmit')
    async onSubmit(values: FormFields) {
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
