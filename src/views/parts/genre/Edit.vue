<template>
    <div>
        <h1>Update genre</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <genre-form :target="target" v-on:onSubmit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
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
export default class Edit extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    created() {
        if (!this.target) {
            this.$router.push({ name: 'genre' });
        }
    }

    get target() {
        const genres = this.$store.getters['genre/genres'];
        return genres.find(genre => Number(this.$route.params.id) === genre.id);
    }

    onErrorHandle(err: any) {
        this.message = resetMessage();
        if (isAxiosError(err)) {
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
    }

    async onRegister(values: FormFields) {
        const target = this.target;
        if (!target) {
            this.$router.push({ name: 'genre' });
            return;
        }

        const { name, color } = values;

        await this.$store.dispatch('genre/onUpdateGenre', {
            id: target.id,
            genre: {
                name,
                color
            }
        });

        this.$success({
            title: 'Update success 👏',
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

#components-form-validate-other .dropbox {
    height: 180px;
    line-height: 1.5;
}

#preview_image {
    width: 150px;
    height: 150px;
}

.image-uploader > .ant-upload {
    width: 170px;
    height: 170px;
}

.form-submit-button {
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
}
</style>
