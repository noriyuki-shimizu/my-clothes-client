<template>
    <a-form :form="form" v-bind="formItemLayout" @submit="handleSubmit">
        <a-form-item :label="$t('dictionary.brand.name')">
            <a-input
                v-decorator="[
                    'name',
                    {
                        rules: [
                            {
                                max: 60,
                                message: $t('message.validation.brand.name.max')
                            },
                            {
                                required: true,
                                message: $t(
                                    'message.validation.brand.name.required'
                                )
                            },
                            {
                                message: $t(
                                    'message.validation.brand.name.duplication'
                                ),
                                validator: nameValidator
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <a-form-item :label="$t('dictionary.image')">
            <a-upload
                v-decorator="['image', {}]"
                name="image"
                listType="picture-card"
                class="image-uploader"
                accept="image/*"
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                :customRequest="setSelectImage"
            >
                <img
                    id="preview_image"
                    v-if="imageURL"
                    :src="imageURL"
                    alt="brand image"
                />
                <div v-else>
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                        {{ $t('operation.select') }}
                    </div>
                </div>
            </a-upload>
        </a-form-item>

        <a-form-item :label="$t('dictionary.link')">
            <a-input
                v-decorator="[
                    'link',
                    {
                        rules: [
                            {
                                max: 100,
                                message: $t('message.validation.link.max')
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <a-form-item :label="$t('dictionary.brand.country')">
            <a-input
                v-decorator="[
                    'country',
                    {
                        rules: [
                            {
                                max: 15,
                                message: $t(
                                    'message.validation.brand.country.max'
                                )
                            },
                            {
                                required: true,
                                message: $t(
                                    'message.validation.brand.country.required'
                                )
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <div class="form-submit-button">
            <a-button html-type="submit" type="primary">
                {{ $t('operation.submit') }}
            </a-button>
        </div>
    </a-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
import {
    WrappedFormUtils,
    FieldDecorator
} from 'ant-design-vue/types/form/form';
import {
    UploadingFileInfo,
    DoneUploadFileInfo,
    ExUploadFile
} from 'ant-design-vue/types/upload';
import * as Vuex from 'vuex';

import { formItemLayout } from '@/components/brand/form';
import { FormFields } from '@/components/brand/type';
import { Brand } from '@/store/brand/type';
import { getBase64, isLt5M } from '@/util/file';
import { Route } from 'vue-router';

@Component
export default class BrandForm extends Vue {
    @Prop({ type: Object as () => Brand })
    target?: Brand;

    $store!: Vuex.ExStore;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    created() {
        this.form = this.$form.createForm(this);
    }

    @Watch('$i18n.locale')
    onLocalChange() {
        const fieldsValue = this.form.getFieldsValue();
        this.form.resetFields();
        this.form.setFieldsValue(fieldsValue);
    }

    @Watch('target')
    onTargetChange(newBrand: Brand) {
        if (newBrand) {
            this.form.setFieldsValue({
                name: newBrand.name,
                link: newBrand.link,
                country: newBrand.country
            });

            this.imageURL = newBrand.imageLink || '';
        }
    }

    nameValidator(_: any, value: string, cb: Function) {
        // FIXME 重複チェックを API に問い合わせること
        const { id } = this.$route.params;
        const brands = this.$store.getters['brand/brands'] as Readonly<Brand>[];

        const someBrand = id
            ? (brand: Brand) => brand.name === value && brand.id !== Number(id)
            : (brand: Brand) => brand.name === value;

        brands.some(someBrand) ? cb(true) : cb();
    }

    beforeUpload(file: File) {
        const isBeforeCheck = isLt5M(file);
        if (!isBeforeCheck) {
            const errorMessage = this.$t('message.error.image-capacity', {
                capacity: '2MB'
            }).toString();
            this.$message.error(errorMessage);
        }
        return isBeforeCheck;
    }

    setSelectImage(file: any) {
        var fileReader = new FileReader();
        fileReader.onload = () => {
            this.imageURL = fileReader.result;
        };
        fileReader.readAsDataURL(file.file);
    }

    handleSubmit(e: Event) {
        e.preventDefault();
        this.form.validateFields(async (err, values: FormFields) => {
            if (!err) {
                this.$emit<FormFields>('on-submit', values);
            }
        });
    }
}
</script>

<style>
@import '../../assets/css/form/ant.css';

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
