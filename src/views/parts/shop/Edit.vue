<template>
    <div>
        <h1>Update shop</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <shop-form :target="target" v-on:on-submit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
import * as Vuex from 'vuex';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { AppMessage } from 'ant-design-vue/types/message';

import ShopForm from '@/components/shop/Form.vue';
import { ConvertedFormFields } from '@/components/shop/type';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        ShopForm
    }
})
export default class Edit extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    created() {
        if (!this.target) {
            this.$router.push({ name: 'shop' });
        }
    }

    get target() {
        const shops = this.$store.getters['shop/shops'];
        return shops.find(shop => Number(this.$route.params.id) === shop.id);
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

    async onRegister(values: ConvertedFormFields) {
        const target = this.target;
        if (!target) {
            this.$router.push({ name: 'shop' });
            return;
        }

        const { shop, imageFile } = values;
        await this.$store.dispatch('shop/onUpdateShop', {
            id: target.id,
            shop: {
                ...shop,
                imageId: target.imageId,
                imageLink: target.imageLink
            },
            imageFile
        });

        this.$success({
            title: 'Update success 👏',
            onOk: () => {
                this.$router.push({ name: 'shop' });
            }
        });
    }

    @Emit('on-submit')
    async onSubmit(values: ConvertedFormFields) {
        this.$confirm({
            title: 'Are you sure you want to register?',
            content: 'The entered information is registered.',
            onOk: async () => {
                await this.onRegister(values).catch(this.onError);
            }
        });
    }
}
</script>

<style>
.alert-message {
    margin-bottom: 20px;
}

#components-form-validate-other .dropbox {
    height: 180px;
    line-height: 1.5;
}

#preview_image {
    width: 150px;
    height: 150px;
}

.image-uploader > .ant-upload {
    width: 170px;
    height: 170px;
}

.form-submit-button {
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
}
</style>
