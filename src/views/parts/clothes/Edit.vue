<template>
    <div>
        <h1>Update clothes</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <clothes-form :target="target" v-on:onSubmit="onSubmit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import ClothesForm from '@/components/clothes/Form.vue';
import { ConvertedFormFields } from '@/components/clothes/form';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        ClothesForm
    }
})
export default class Edit extends Vue {
    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    created() {
        if (!this.target) {
            this.$router.push({ name: 'clothes' });
        }
    }

    get target() {
        const clothes = this.$store.getters['clothes/clothes'];
        return clothes.find(
            clothes => Number(this.$route.params.id) === clothes.id
        );
    }

    async onRegister(values: ConvertedFormFields) {
        const target = this.target;
        if (!target) {
            this.$router.push({ name: 'clothes' });
            return;
        }

        const { clothes, imageFile } = values;
        await this.$store.dispatch('clothes/onUpdateClothes', {
            id: target.id,
            clothes: {
                ...clothes,
                imageId: target.imageId,
                imageLink: target.imageLink
            },
            imageFile
        });

        this.$success({
            title: 'Update success 👏',
            onOk: () => {
                this.$router.push({ name: 'clothes' });
            }
        });
    }

    @Emit('onError')
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

    @Emit('onSubmit')
    async onSubmit(values: ConvertedFormFields) {
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
