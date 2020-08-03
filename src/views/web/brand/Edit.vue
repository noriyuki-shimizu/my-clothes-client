<template>
    <div>
        <a-page-header
            :title="$t('title.brand')"
            :subTitle="$t('title.sub-title.update-item')"
        />
        <a-divider class="c-pipe" />
        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <brand-form :target="target" v-on:on-submit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import BrandForm from '@/components/brand/Form.vue';
import { FormFields } from '@/components/brand/type';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        BrandForm
    }
})
export default class Edit extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'brand' });
            return;
        }

        this.$store
            .dispatch('brand/fetchBrand', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('brand/resetBrand');
    }

    get target() {
        return this.$store.getters['brand/brand'];
    }

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
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'brand' });
            return;
        }

        await this.$store.dispatch('brand/onUpdateBrand', {
            id: Number(id),
            ...values
        });

        const okText = this.$t('operation.yes').toString();
        this.$success({
            title: this.$t('message.success.update-complete'),
            okText,
            onOk: () => {
                this.$router.push({ name: 'brand' });
            }
        });
    }

    @Emit('on-submit')
    onSubmit(values: FormFields) {
        const okText = this.$t('operation.yes').toString();
        const cancelText = this.$t('operation.cancel').toString();
        this.$confirm({
            title: this.$t('message.confirm.update'),
            okText,
            cancelText,
            onOk: async () => {
                await this.onRegister(values).catch(this.onError);
            },
            onCancel() {}
        });
    }
}
</script>
