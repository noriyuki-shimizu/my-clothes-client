<template>
    <div>
        <a-page-header
            class="mc-page-title"
            :title="$t('title.clothes')"
            :subTitle="$t('title.sub-title.update-item')"
        />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <clothes-form
            :target="target"
            v-on:on-submit="onSubmit"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import ClothesForm from '@/components/clothes/Form.vue';
import { resetMessage } from '@/util/message';
import { FormFields } from '@/components/clothes/type';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        ClothesForm
    }
})
export default class Edit extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'clothes' });
            return;
        }

        this.$store
            .dispatch('clothes/fetchOne', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('clothes/resetItem');
    }

    get target() {
        return this.$store.getters['clothes/item'];
    }

    async onRegister(values: FormFields) {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'clothes' });
            return;
        }

        await this.$store.dispatch('clothes/onUpdateClothes', {
            id: Number(id),
            ...values
        });

        const okText = this.$t('operation.yes').toString();
        this.$success({
            title: this.$t('message.success.update-complete'),
            okText,
            onOk: () => {
                this.$router.push({ name: 'clothes' });
            }
        });
    }

    private setMessage(message?: AppMessage) {
        this.message = message || resetMessage();
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

    @Emit('on-submit')
    onSubmit(values: FormFields) {
        const okText = this.$t('operation.yes').toString();
        const cancelText = this.$t('operation.cancel').toString();
        this.$confirm({
            title: this.$t('message.confirm.update'),
            okText,
            cancelText,
            onOk: async () => {
                this.setMessage();
                await this.onRegister(values).catch(this.onError);
            },
            onCancel() {}
        });
    }
}
</script>
