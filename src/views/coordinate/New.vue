<template>
    <div>
        <h1>Coordinate New</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <coordinate-form v-on:on-submit="onSubmit" v-on:on-error="onError" />
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
export default class New extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    private async onRegister(values: FormFields) {
        await this.$store.dispatch('coordinate/onAddCoordinate', values);

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                this.$router.push({ name: 'coordinate' });
            }
        });
    }

    onResetMessage() {
        this.message = resetMessage();
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
<style>
#preview_image {
    width: 160px;
    height: 180px;
}

.image-uploader > .ant-upload {
    width: 180px;
    height: 200px;
}

.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}

.selected-item-image {
    height: 160px;
    width: 140px;
}

.alert-message {
    margin-bottom: 20px;
}

.select-item-table {
    padding-bottom: 20px;
}
</style>
