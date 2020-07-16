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
                                required: !this.target
                            }
                        ]
                    }
                ]"
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

        <a-form-item label="Brand">
            <a-select
                v-decorator="[
                    'brandId',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please select your brand'
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
            <a v-if="!assistBrands.length" @click="movePartNewPage('brand')">
                Please create a brand
            </a>
        </a-form-item>

        <a-form-item label="Shop">
            <a-select
                v-decorator="[
                    'shopId',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please select your shop'
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
            <a v-if="!assistShops.length" @click="movePartNewPage('shop')">
                Please create a shop
            </a>
        </a-form-item>

        <a-form-item label="Genres">
            <a-checkbox-group
                v-decorator="[
                    'genreIds',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please select your genre'
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
            <a v-if="!assistGenres.length" @click="movePartNewPage('genre')">
                Please create a genre
            </a>
        </a-form-item>

        <a-form-item label="Price">
            <a-input-number
                v-decorator="[
                    'price',
                    {
                        initialValue: 0,
                        rules: [
                            {
                                required: true,
                                message: 'Please input price'
                            }
                        ]
                    }
                ]"
                :min="0"
                :max="9999999"
            />
        </a-form-item>

        <a-form-item label="Buy date">
            <a-date-picker
                v-decorator="[
                    'buyDate',
                    {
                        rules: [
                            {
                                type: 'object',
                                required: true,
                                message: 'Please select buy date'
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <a-form-item label="Comment">
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

        <a-form-item label="Satisfaction">
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

import { formItemLayout } from '@/components/clothes/form';
import { FormFields } from '@/components/clothes/type';
import { Clothes } from '@/store/clothes/type';
import { getBase64, isLt5M } from '@/util/file';
import { dateFormat } from '@/util/date';
import { isMobile } from '../../util/userAgent';

@Component
export default class ClothesForm extends Vue {
    @Prop({ type: Object as () => Clothes })
    target?: Clothes;

    $store!: Vuex.ExStore;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    imageLoading = false;

    created() {
        this.fetchAssists();
        this.form = this.$form.createForm(this);
    }

    @Watch('target')
    onTargetChange(newClothes: Clothes) {
        if (newClothes) {
            this.form.setFieldsValue({
                brandId: newClothes.brand.id,
                shopId: newClothes.shop.id,
                genreIds: newClothes.genres.map(genre => genre.id),
                price: newClothes.price,
                buyDate: moment(newClothes.buyDate, dateFormat),
                comment: newClothes.comment,
                satisfaction: newClothes.satisfaction
            });
            this.imageURL = newClothes.imageLink || '';
        }
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

    async fetchAssists() {
        await Promise.all([
            this.$store.dispatch('clothes/fetchAssistGenres'),
            this.$store.dispatch('clothes/fetchAssistBrands'),
            this.$store.dispatch('clothes/fetchAssistShops')
        ]).catch(err => {
            this.$emit('on-error', err);
        });
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

    movePartNewPage(part: string) {
        this.$router.push({
            path: isMobile()
                ? `/mobile/maintenance/${part}/new`
                : `/maintenance/${part}/new`,
            query: {
                next: 'back'
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
