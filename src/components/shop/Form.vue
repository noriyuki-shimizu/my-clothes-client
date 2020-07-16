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
                                    'A shop with the same name already exists.',
                                validator: nameValidator
                            }
                        ]
                    }
                ]"
                placeholder="Please enter shop name"
            />
        </a-form-item>

        <a-form-item label="Image">
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
                placeholder="Enter the link for the target shop"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Station name">
            <a-input
                v-decorator="[
                    'stationName',
                    {
                        rules: [
                            {
                                required: true
                            },
                            {
                                max: 30
                            }
                        ]
                    }
                ]"
                placeholder="Enter the station name for the target shop"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Address">
            <a-input
                v-decorator="[
                    'address',
                    {
                        rules: [
                            {
                                required: true
                            },
                            {
                                max: 60
                            }
                        ]
                    }
                ]"
                placeholder="Enter the address for the target shop"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Business hours (start)">
            <a-time-picker
                v-decorator="[
                    'startBusinessHours',
                    {
                        rules: [
                            {
                                required: true
                            }
                        ],
                        initialValue: initialTime
                    }
                ]"
                format="HH:mm"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Business hours (end)">
            <a-time-picker
                v-decorator="[
                    'endBusinessHours',
                    {
                        rules: [
                            {
                                required: true
                            }
                        ],
                        initialValue: initialTime
                    }
                ]"
                format="HH:mm"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Tel">
            <a-input
                v-decorator="[
                    'tel',
                    {
                        rules: [
                            {
                                required: true
                            },
                            {
                                max: 15
                            },
                            {
                                pattern: /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/,
                                message:
                                    'The format is incorrect. If there is -, please remove it.'
                            }
                        ]
                    }
                ]"
                placeholder="Enter the tel for the target shop"
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
import { getBase64, isLt5M } from '@/util/file';
import { timeFormat } from '@/util/date';

@Component
export default class ShopForm extends Vue {
    @Prop({ type: Object as () => Shop })
    target?: Shop;

    $store!: Vuex.ExStore;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    initialTime = moment('00:00', timeFormat);

    imageURL: string | ArrayBuffer | null = '';

    imageLoading = false;

    nameValidator(_: any, value: string, cb: Function) {
        const { id } = this.$route.params;
        const shops = this.$store.getters['shop/shops'] as Readonly<Shop>[];

        const someShop = id
            ? (shop: Shop) => shop.name === value && shop.id !== Number(id)
            : (shop: Shop) => shop.name === value;

        shops.some(someShop) ? cb(true) : cb();
    }

    created() {
        this.form = this.$form.createForm(this);
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
        const isBeforeCheck = isLt5M(file);
        if (!isBeforeCheck) {
            this.$message.error('Image must smaller than 2MB');
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
