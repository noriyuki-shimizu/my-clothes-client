<template>
    <a-form
        id="components-form-validate-other"
        :form="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
    >
        <a-form-item v-bind="formItemLayout" label="Name">
            <a-input
                v-decorator="[
                    'name',
                    {
                        rules: [
                            {
                                max: 60
                            },
                            {
                                required: true
                            },
                            {
                                message:
                                    'A brand with the same name already exists.',
                                validator: nameValidator
                            }
                        ]
                    }
                ]"
                placeholder="Please enter brand name"
            />
        </a-form-item>

        <a-form-item label="Image">
            <a-upload
                v-decorator="['image', {}]"
                name="image"
                listType="picture-card"
                class="image-uploader"
                :showUploadList="false"
                action="http://www.mocky.io/v2/5cc8019d300000980a055e76"
                :beforeUpload="beforeUpload"
                @change="handleChange"
                accept="image/*"
            >
                <img
                    id="preview_image"
                    v-if="imageURL"
                    :src="imageURL"
                    alt="avatar"
                />
                <div v-else>
                    <a-icon :type="imageLoading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">Upload</div>
                </div>
            </a-upload>
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Link">
            <a-input
                v-decorator="[
                    'link',
                    {
                        rules: [
                            {
                                max: 100
                            }
                        ]
                    }
                ]"
                placeholder="Enter the link for the target brand"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Country">
            <a-input
                v-decorator="[
                    'country',
                    {
                        rules: [
                            {
                                max: 15
                            },
                            {
                                required: true
                            }
                        ]
                    }
                ]"
                placeholder="Enter the country for the target brand"
            />
        </a-form-item>

        <div class="form-submit-button">
            <a-button html-type="submit" type="primary">
                Submit
            </a-button>
        </div>
    </a-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
import {
    WrappedFormUtils,
    FieldDecorator
} from 'ant-design-vue/types/form/form';
import {
    UploadingFileInfo,
    DoneUploadFileInfo
} from 'ant-design-vue/types/upload';
import * as Vuex from 'vuex';

import { formItemLayout, FormFields } from '@/components/brand/form';
import { Brand } from '@/store/brand/type';
import { getBase64 } from '@/util/file';
import { Route } from 'vue-router';

@Component
export default class BrandForm extends Vue {
    @Prop({ type: Object as () => Brand })
    target?: Brand;

    $store!: Vuex.ExStore;

    form!: WrappedFormUtils;

    nameValidator(_: any, value: string, cb: Function) {
        const { id } = this.$route.params;
        const brands = this.$store.getters['brand/brands'] as Readonly<Brand>[];

        const someBrand = id
            ? (brand: Brand) => brand.name === value && brand.id !== Number(id)
            : (brand: Brand) => brand.name === value;

        brands.some(someBrand) ? cb(true) : cb();
    }

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    imageLoading = false;

    created() {
        if (this.target) {
            const { target } = this;
            this.form = this.$form.createForm(this, {
                mapPropsToFields: () => {
                    return {
                        name: this.$form.createFormField({
                            value: target.name
                        }),
                        link: this.$form.createFormField({
                            value: target.link
                        }),
                        country: this.$form.createFormField({
                            value: target.country
                        })
                    };
                }
            });
            this.imageURL = target.imageLink || '';
            return;
        }
        this.form = this.$form.createForm(this);
    }

    beforeUpload(file: File) {
        const isLt5M = file.size < 5 * 1024 * 1024;
        if (!isLt5M) {
            this.$message.error('Image must smaller than 2MB!');
        }
        return isLt5M;
    }

    handleChange(info: UploadingFileInfo | DoneUploadFileInfo) {
        if (info.file.status === 'uploading') {
            this.imageURL = '';
            this.imageLoading = true;
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageURLTmp => {
                this.imageURL = imageURLTmp;
                this.imageLoading = false;
            });
        }
    }

    handleSubmit(e: Event) {
        e.preventDefault();
        this.form.validateFields(async (err, values: FormFields) => {
            if (!err) {
                this.$emit('onSubmit', values);
            }
        });
    }
}
</script>

<style>
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
