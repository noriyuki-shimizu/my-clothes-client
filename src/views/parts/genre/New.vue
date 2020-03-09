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
        <genre-form v-on:on-submit="onSubmit" v-on:on-error="onError" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import GenreForm from '@/components/genre/Form.vue';
import { FormFields } from '@/components/genre/type';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        GenreForm
    }
})
export default class New extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

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
