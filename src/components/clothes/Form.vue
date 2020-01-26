<template>
    <a-form
        id="components-form-validate-other"
        :form="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
    >
        <a-form-item label="Image">
            <a-upload
                v-decorator="[
                    'image',
                    {
                        rules: [
                            {
                                required: true
                            }
                        ]
                    }
                ]"
                name="image"
                listType="picture-card"
                class="image-uploader"
                :showUploadList="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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

        <a-form-item v-bind="formItemLayout" label="Brand">
            <a-select
                v-decorator="[
                    'brandId',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please select your brand!'
                            }
                        ]
                    }
                ]"
                placeholder="Select a option and change input text above"
            >
                <a-select-option
                    v-for="(assistBrand, i) in assistBrands"
                    :key="i"
                    :value="assistBrand.id"
                >
                    {{ assistBrand.name }}
                </a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Shop">
            <a-select
                v-decorator="[
                    'shopId',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please select your shop!'
                            }
                        ]
                    }
                ]"
                placeholder="Select a option and change input text above"
            >
                <a-select-option
                    v-for="(assistShop, i) in assistShops"
                    :key="i"
                    :value="assistShop.id"
                >
                    {{ assistShop.name }}
                </a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Genres">
            <a-checkbox-group
                v-decorator="[
                    'genreIds',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please select your genre!'
                            }
                        ]
                    }
                ]"
                style="width: 100%;"
            >
                <a-row>
                    <a-col
                        v-for="(assistGenre, i) in assistGenres"
                        :key="i"
                        :span="8"
                    >
                        <a-checkbox :value="assistGenre.id">
                            <a-tag :color="assistGenre.color">{{
                                assistGenre.name
                            }}</a-tag>
                        </a-checkbox>
                    </a-col>
                </a-row>
            </a-checkbox-group>
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Price">
            <a-input-number
                v-decorator="[
                    'price',
                    {
                        initialValue: 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input price!'
                            }
                        ]
                    }
                ]"
                :min="0"
                :max="9999999"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Buy date">
            <a-date-picker
                v-decorator="[
                    'buyDate',
                    {
                        rules: [
                            {
                                type: 'object',
                                required: true,
                                message: 'Please select buy date!'
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Comment">
            <a-textarea
                v-decorator="[
                    'comment',
                    {
                        rules: [
                            {
                                max: 255
                            }
                        ]
                    }
                ]"
                placeholder="Enter the comment for the target clothes"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Satisfaction">
            <a-rate
                v-decorator="['satisfaction', { initialValue: 2.5 }]"
                allow-half
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
import { Route } from 'vue-router';
import * as Vuex from 'vuex';
import moment from 'moment';

import {
    formItemLayout,
    FormFields,
    convertFormFields,
    ConvertedFormFields
} from '@/components/clothes/form';
import { Clothes } from '@/store/clothes/type';
import { getBase64, isLt5M } from '@/util/file';
import { dateFormat } from '@/util/date';

@Component
export default class ClothesForm extends Vue {
    @Prop({ type: Object as () => Clothes })
    target?: Clothes;

    $store!: Vuex.ExStore;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    imageLoading = false;

    async beforeCreate() {
        await Promise.all([
            this.$store.dispatch('clothes/fetchAssistGenres'),
            this.$store.dispatch('clothes/fetchAssistBrands'),
            this.$store.dispatch('clothes/fetchAssistShops')
        ]).catch(err => {
            this.$emit('onErrorHandle', err);
        });
        if (!this.assistBrands.length) {
            this.toRegistrationTransfer('brand', 'brandNew');
            return;
        }
        if (!this.assistShops.length) {
            this.toRegistrationTransfer('shop', 'shopNew');
            return;
        }
        if (!this.assistGenres.length) {
            this.toRegistrationTransfer('genre', 'genreNew');
            return;
        }
    }

    created() {
        if (this.target) {
            const { target } = this;

            this.form = this.$form.createForm(this, {
                mapPropsToFields: () => {
                    return {
                        brandId: this.$form.createFormField({
                            value: target.brand.id
                        }),
                        shopId: this.$form.createFormField({
                            value: target.shop.id
                        }),
                        genreIds: this.$form.createFormField({
                            value: target.genres.map(genre => genre.id)
                        }),
                        price: this.$form.createFormField({
                            value: target.price
                        }),
                        buyDate: this.$form.createFormField({
                            value: moment(target.buyDate, dateFormat)
                        }),
                        comment: this.$form.createFormField({
                            value: target.comment
                        }),
                        satisfaction: this.$form.createFormField({
                            value: target.satisfaction
                        })
                    };
                }
            });
            this.imageURL = target.imageLink || '';
            return;
        }
        this.form = this.$form.createForm(this);
    }

    get assistGenres() {
        return this.$store.getters['clothes/assistGenres'];
    }

    get assistBrands() {
        return this.$store.getters['clothes/assistBrands'];
    }

    get assistShops() {
        return this.$store.getters['clothes/assistShops'];
    }

    toRegistrationTransfer(registrationName: string, routerName: string) {
        this.$warning({
            title: 'Have you registered?',
            content: `It looks like no ${registrationName} has been registered. Please register first.`,
            onOk: () => {
                this.$router.push({ name: routerName });
            }
        });
    }

    beforeUpload(file: File) {
        const isBeforeCheck = isLt5M(file);
        if (!isBeforeCheck) {
            this.$message.error('Image must smaller than 2MB!');
        }
        return isBeforeCheck;
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
                this.$emit<ConvertedFormFields>(
                    'onSubmit',
                    convertFormFields(values)
                );
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
