<template>
    <div>
        <a-page-header title="Shop" subTitle="edit item" />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <shop-form
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

import ShopForm from '@/components/shop/Form.vue';
import { resetMessage } from '@/util/message';
import { FormFields } from '@/components/shop/type';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        ShopForm
    }
})
export default class Edit extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

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

        this.$success({
            title: 'Update success 👏',
            onOk: () => {
                this.$router.push({ name: 'mobileShop' });
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
