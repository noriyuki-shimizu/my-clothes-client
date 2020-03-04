<template>
    <div>
        <h1>Update brand</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <brand-form :target="target" v-on:onSubmit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import BrandForm from '@/components/brand/Form.vue';
import { FormFields } from '@/components/brand/type';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        BrandForm
    }
})
export default class Edit extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    created() {
        if (!this.target) {
            this.$router.push({ name: 'brand' });
        }
    }

    get target() {
        const brands = this.$store.getters['brand/brands'];
        return brands.find(brand => Number(this.$route.params.id) === brand.id);
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
        const target = this.target;
        if (!target) {
            this.$router.push({ name: 'brand' });
            return;
        }

        const { name, image, link, country } = values;
        const imageFile = image && image.file ? image.file.originFileObj : null;

        await this.$store.dispatch('brand/onUpdateBrand', {
            id: target.id,
            brand: {
                name,
                link,
                imageId: target.imageId,
                imageLink: target.imageLink,
                country
            },
            imageFile
        });

        this.$success({
            title: 'Update success 👏',
            onOk: () => {
                this.$router.push({ name: 'brand' });
            }
        });
    }

    @Emit('onSubmit')
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
