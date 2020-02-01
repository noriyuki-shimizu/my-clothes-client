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

            <a-form-item v-bind="formItemLayout" label="Season">
                <a-select
                    v-decorator="[
                        'season',
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
                        v-for="season in seasons"
                        :key="season"
                        :value="season"
                    >
                        {{ season }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item v-bind="formItemLayout" label="Item">
                <a-checkbox-group
                    v-decorator="[
                        'clothingIds',
                        {
                            rules: [
                                {
                                    required: true
                                }
                            ]
                        }
                    ]"
                    style="width: 100%;"
                >
                    <a-empty v-if="!coordinateCheckboxGroupItems.length" />
                    <a-row v-else>
                        <a-col :span="30">
                            <a-checkbox
                                v-for="(item,
                                i) in coordinateCheckboxGroupItems"
                                :key="i"
                                :value="item.key"
                                @change="() => onRemoveItemKey(item.key)"
                            >
                                <img
                                    class="selected-item-image"
                                    :src="item.imageLink"
                                />
                            </a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-form-item>

            <a-table
                class="select-item-table"
                :dataSource="coordinateTableItems"
                :columns="columns"
                :scroll="{ x: 1200, y: 500 }"
                :pagination="{ pageSize: 50 }"
                :loading="tableLoading"
                :rowSelection="{
                    selectedRowKeys,
                    onSelect
                }"
            >
                <span slot="genres" slot-scope="genres">
                    <a-tag
                        v-for="(genre, i) in genres"
                        :color="genre.color"
                        :key="i"
                    >
                        {{ genre.name }}
                    </a-tag>
                </span>

                <span slot="price" slot-scope="price">
                    <div class="column-price">
                        {{ price.toLocaleString() }}
                    </div>
                </span>

                <span slot="satisfaction" slot-scope="satisfaction">
                    <a-rate
                        :defaultValue="satisfaction"
                        disabled
                        allow-half
                        style="text-align: center !important"
                    />
                </span>

                <a-icon
                    slot="filterIcon"
                    slot-scope="filtered"
                    type="search"
                    :style="{ color: filtered ? '#108ee9' : undefined }"
                />

                <span slot="imageLink" slot-scope="imageLink">
                    <img
                        class="coordinate-item-table-image"
                        :src="
                            imageLink
                                ? imageLink
                                : require('@/assets/no-img.png')
                        "
                    />
                </span>
            </a-table>

            <div class="form-submit-button">
                <a-button html-type="submit" type="primary">
                    Submit
                </a-button>
            </div>
        </a-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';
import { WrappedFormUtils, Form } from 'ant-design-vue/types/form/form';
import {
    UploadingFileInfo,
    DoneUploadFileInfo
} from 'ant-design-vue/types/upload';
import moment, { Moment } from 'moment';

import { isAxiosError } from '@/plugins/api';
import { resetMessage } from '@/util/reset';
import { CoordinateItem } from '@/store/coordinate/type';
import { getBase64, isLt5M } from '@/util/file';
import { AssistBrand, AssistShop, AssistGenre } from '@/store/clothes/type';
import { FormFields, formItemLayout } from './form';
import { Record, getColumns } from './table';

@Component
export default class New extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    // TODO: ハードコードを直す
    readonly seasons = ['spring', 'summer', 'autumn', 'winter'];

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    imageLoading = false;

    tableLoading = false;

    selectedRowKeys: number[] = [];

    columns = getColumns(
        this.$store.getters['clothes/assistBrands'],
        this.$store.getters['clothes/assistShops'],
        this.$store.getters['clothes/assistGenres']
    );

    async beforeCreate() {
        this.tableLoading = true;

        await Promise.all([
            this.$store.dispatch('coordinate/fetchCoordinateItems'),
            this.$store.dispatch('clothes/fetchAssistGenres'),
            this.$store.dispatch('clothes/fetchAssistBrands'),
            this.$store.dispatch('clothes/fetchAssistShops')
        ]).catch(err => {
            this.onError(err);
        });

        this.tableLoading = false;
    }

    created() {
        this.form = this.$form.createForm(this);
    }

    get coordinateTableItems() {
        return this.dataSource.filter(
            coordinateItem =>
                this.selectedRowKeys.indexOf(coordinateItem.key) === -1
        );
    }

    get coordinateCheckboxGroupItems() {
        return this.dataSource.filter(
            coordinateItem =>
                this.selectedRowKeys.indexOf(coordinateItem.key) !== -1
        );
    }

    get dataSource() {
        const coordinateItems = this.$store.getters[
            'coordinate/coordinateItems'
        ];
        return coordinateItems.map(coordinateItem => {
            const {
                id,
                imageLink,
                brandName,
                shopName,
                genres,
                price,
                buyDate,
                comment,
                satisfaction
            } = coordinateItem;

            return {
                key: id,
                price: String(price),
                imageLink,
                brandName,
                shopName,
                genres,
                buyDate,
                comment,
                satisfaction
            };
        }) as Record[];
    }

    onSelect(record: Record) {
        this.selectedRowKeys.push(record.key);
        this.form.setFieldsValue({ clothingIds: this.selectedRowKeys });
    }

    onRemoveItemKey(key: number) {
        this.selectedRowKeys = this.selectedRowKeys.filter(
            selectedRowKey => key !== selectedRowKey
        );
        this.form.setFieldsValue({ clothingIds: this.selectedRowKeys });
    }

    beforeUpload(file: File) {
        const isBeforeCheck = isLt5M(file);
        if (!isBeforeCheck) {
            this.$message.error('Image must smaller than 2MB');
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
                this.$confirm({
                    title: 'Are you sure you want to register?',
                    content: 'The entered information is registered.',
                    onOk: async () => {
                        try {
                            await this.onRegister(values);
                        } catch (err) {
                            this.onError(err);
                        }
                    },
                    onCancel() {}
                });
            }
        });
    }

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

    @Emit('onResetMessage')
    onResetMessage() {
        this.message = resetMessage();
    }

    @Emit('onError')
    onError(err: any) {
        if (isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                const { $store, $router } = this;
                this.$warning({
                    title: 'Certification expired',
                    content: 'Please sign in again.',
                    onOk: () => {
                        $store.dispatch('user/signOut');
                        $router.push({
                            name: 'signIn',
                            params: { again: 'again' }
                        });
                    }
                });
                return;
            }

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
    width: 110px;
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
