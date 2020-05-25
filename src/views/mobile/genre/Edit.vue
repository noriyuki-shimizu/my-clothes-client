<template>
    <div>
        <a-page-header title="Genre" subTitle="edit item" />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <genre-form
            :target="target"
            v-on:on-submit="onSubmit"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import GenreForm from '@/components/genre/Form.vue';
import { resetMessage } from '@/util/message';
import { FormFields } from '@/components/genre/type';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        GenreForm
    }
})
export default class Edit extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileGenre' });
            return;
        }

        this.$store
            .dispatch('genre/fetchGenre', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('genre/resetGenre');
    }

    get target() {
        return this.$store.getters['genre/genre'];
    }

    async onRegister(values: FormFields) {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileGenre' });
            return;
        }

        await this.$store.dispatch('genre/onUpdateGenre', {
            id: Number(id),
            ...values
        });

        this.$success({
            title: 'Update success 👏',
            onOk: () => {
                this.$router.push({ name: 'mobileGenre' });
            }
        });
    }

    private setMessage(message?: AppMessage) {
        this.message = message || resetMessage();
    }

    @Emit('on-error')
    onError(err: any) {
        handleForbiddenError(err, this.$store, this.$router);

        this.setMessage({
            isShow: true,
            text: `Error (${err.message})`,
            description: err.response
                ? err.response.data
                : `Access URL: ${err.config.url}`,
            type: 'error'
        });
    }

    @Emit('on-submit')
    async onSubmit(values: FormFields) {
        this.$confirm({
            title: 'Are you sure you want to register?',
            content: 'The entered information is registered.',
            onOk: async () => {
                this.setMessage();
                await this.onRegister(values).catch(this.onError);
            },
            onCancel() {}
        });
    }
}
</script>
