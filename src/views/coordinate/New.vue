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

        <coordinate-form
            v-on:on-register="onRegister"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import CoordinateForm from '@/components/coordinate/Form.vue';
import { resetMessage } from '@/util/reset';
import { FormFields } from '@/components/coordinate/type';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        CoordinateForm
    }
})
export default class New extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    @Emit('on-register')
    async onRegister(values: FormFields) {
        const { season, clothingIds, image } = values;

        const imageFile = image && image.file ? image.file.originFileObj : null;

        await this.$store.dispatch('coordinate/onAddCoordinate', {
            coordinate: {
                season,
                clothingIds
            },
            imageFile
        });

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

.coordinate-item-table-image {
    height: 140px;
    width: 120px;
}

.selected-item-image {
    height: 140px;
    width: 110px;
}

.alert-message {
    margin-bottom: 20px;
}

.select-item-table {
    padding-bottom: 20px;
}
</style>
