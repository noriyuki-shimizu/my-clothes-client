<template>
    <div>
        <a-page-header
            class="mc-page-title"
            :title="$t('title.coordinate')"
            :subTitle="$t('title.sub-title.new-item')"
        />
        <a-divider class="c-pipe" />
        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <coordinate-mobile-form
            v-on:on-submit="onSubmit"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import CoordinateMobileForm from '@/components/coordinate/MobileForm.vue';
import { resetMessage } from '@/util/message';
import { FormFields } from '@/components/coordinate/type';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        CoordinateMobileForm
    }
})
export default class New extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    private async onRegister(values: FormFields) {
        await this.$store.dispatch('coordinate/onAddCoordinate', values);

        const okText = this.$t('operation.yes').toString();
        this.$success({
            title: this.$t('message.success.create-complete'),
            okText,
            onOk: () => {
                this.$router.push({ name: 'mobileCoordinate' });
            }
        });
    }

    onResetMessage() {
        this.message = resetMessage();
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
            title: this.$t('message.confirm.register'),
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
