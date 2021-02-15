<template>
    <a-form
        id="components-form-validate-other"
        :form="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
    >
        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.shop.name')"
        >
            <a-input
                v-decorator="[
                    'name',
                    {
                        rules: [
                            {
                                max: 60,
                                message: $t('message.validation.shop.name.max')
                            },
                            {
                                required: true,
                                message: $t(
                                    'message.validation.shop.name.required'
                                )
                            },
                            {
                                validator: nameValidator,
                                message: $t(
                                    'message.validation.shop.name.duplication'
                                )
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
                    alt="avatar"
                />
                <div v-else>
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                        {{ $t('operation.select') }}
                    </div>
                </div>
            </a-upload>
        </a-form-item>

        <a-form-item v-bind="formItemLayout" :label="$t('dictionary.link')">
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

        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.shop.station-name')"
        >
            <a-input
                v-decorator="[
                    'stationName',
                    {
                        rules: [
                            {
                                required: true,
                                message: $t(
                                    'message.validation.shop.station-name.required'
                                )
                            },
                            {
                                max: 30,
                                message: $t(
                                    'message.validation.shop.station-name.max'
                                )
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.shop.address')"
        >
            <a-input
                v-decorator="[
                    'address',
                    {
                        rules: [
                            {
                                required: true,
                                message: $t(
                                    'message.validation.shop.address.required'
                                )
                            },
                            {
                                max: 60,
                                message: $t(
                                    'message.validation.shop.address.max'
                                )
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.shop.start-business-hours')"
        >
            <a-time-picker
                v-decorator="[
                    'startBusinessHours',
                    {
                        rules: [
                            {
                                required: true,
                                message: $t(
                                    'message.validation.shop.start-business-hours.required'
                                )
                            }
                        ]
                    }
                ]"
                format="HH:mm"
                placeholder="HH:mm"
            />
        </a-form-item>

        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.shop.end-business-hours')"
        >
            <a-time-picker
                v-decorator="[
                    'endBusinessHours',
                    {
                        rules: [
                            {
                                required: true,
                                message: $t(
                                    'message.validation.shop.end-business-hours.required'
                                )
                            }
                        ]
                    }
                ]"
                format="HH:mm"
                placeholder="HH:mm"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" :label="$t('dictionary.shop.tel')">
            <a-input
                v-decorator="[
                    'tel',
                    {
                        rules: [
                            {
                                required: true,
                                message: $t(
                                    'message.validation.shop.tel.required'
                                )
                            },
                            {
                                max: 15,
                                message: $t('message.validation.shop.tel.max')
                            },
                            {
                                pattern: /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/,
                                message: $t(
                                    'message.validation.shop.tel.format'
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
    DoneUploadFileInfo
} from 'ant-design-vue/types/upload';
import { Route } from 'vue-router';
import * as Vuex from 'vuex';
import moment from 'moment';

import { formItemLayout } from '@/components/shop/form';
import { FormFields } from '@/components/shop/type';
import { Shop } from '@/store/shop/type';
import { getBase64, isLessThan5M } from '@/util/file';
import { timeFormat } from '@/util/date';

@Component
export default class ShopForm extends Vue {
    @Prop({ type: Object as () => Shop })
    target?: Shop;

    $store!: Vuex.ExStore;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    nameValidator(_: any, value: string, cb: Function) {
        // FIXME 重複チェックを API に問い合わせること
        const { id } = this.$route.params;
        const shops = this.$store.getters['shop/shops'] as Readonly<Shop>[];

        const someShop = id
            ? (shop: Shop) => shop.name === value && shop.id !== Number(id)
            : (shop: Shop) => shop.name === value;

        if (shops.some(someShop)) {
            cb(true);
            return;
        }
        cb();
    }

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
    onTargetChange(newShop: Shop) {
        if (newShop) {
            const [
                startBusinessHours,
                endBusinessHours
            ] = newShop.businessHours.split('~');

            this.form.setFieldsValue({
                name: newShop.name,
                link: newShop.link,
                stationName: newShop.stationName,
                address: newShop.address,
                startBusinessHours: moment(startBusinessHours, timeFormat),
                endBusinessHours: moment(endBusinessHours, timeFormat),
                tel: newShop.tel
            });

            this.imageURL = newShop.imageLink || '';
        }
    }

    beforeUpload(file: File) {
        const isBeforeCheck = isLessThan5M(file);
        if (!isBeforeCheck) {
            const errorMessage = this.$t('message.error.image-capacity', {
                capacity: '5MB'
            }).toString();
            this.$message.error(errorMessage);
        }
        return isBeforeCheck;
    }

    setSelectImage(file: any) {
        const fileReader = new FileReader();
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
</style>
