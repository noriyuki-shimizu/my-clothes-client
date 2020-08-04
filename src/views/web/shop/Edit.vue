<template>
    <div>
        <a-page-header
            :title="$t('title.shop')"
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
        <shop-form
            :target="target"
            v-on:on-submit="onSubmit"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
import * as Vuex from 'vuex';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { AppMessage } from 'ant-design-vue/types/message';

import ShopForm from '@/components/shop/Form.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { FormFields } from '@/components/shop/type';

@Component({
    components: {
        ShopForm
    }
})
export default class Edit extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileShop' });
            return;
        }

        this.$store.dispatch('shop/fetchShop', Number(id)).catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('shop/resetShop');
    }

    get target() {
        return this.$store.getters['shop/shop'];
    }

    @Emit('on-error')
    onError(err: any) {
        this.message = resetMessage();
        handleForbiddenError(err, this.$store, this.$router);

        const { data } = err.response;
        this.message = {
            isShow: true,
            text: this.$t('status.error').toString(),
            description: this.$t(data).toString(),
            type: 'error'
        };
    }

    async onRegister(values: FormFields) {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileShop' });
            return;
        }

        await this.$store.dispatch('shop/onUpdateShop', {
            id: Number(id),
            ...values
        });

        const okText = this.$t('operation.yes').toString();
        this.$success({
            title: this.$t('message.success.update-complete'),
            okText,
            onOk: () => {
                this.$router.push({ name: 'shop' });
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
            }
        });
    }
}
</script>
