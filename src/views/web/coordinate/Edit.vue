<template>
    <div>
        <a-page-header title="Coordinate" subTitle="update item" />
        <a-divider class="c-pipe" />
        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <coordinate-form
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

import CoordinateForm from '@/components/coordinate/Form.vue';
import { resetMessage } from '@/util/message';
import { FormFields } from '@/components/coordinate/type';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        CoordinateForm
    }
})
export default class Edit extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'coordinate' });
        }

        this.$store
            .dispatch('coordinate/fetchCoordinate', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('coordinate/resetCoordinate');
    }

    get target() {
        return this.$store.getters['coordinate/coordinate'];
    }

    private async onRegister(values: FormFields) {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'coordinate' });
            return;
        }

        await this.$store.dispatch('coordinate/onUpdateCoordinate', {
            id: Number(id),
            ...values
        });

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                this.$router.push({ name: 'coordinate' });
            }
        });
    }

    @Emit('on-error')
    onError(err: any) {
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
