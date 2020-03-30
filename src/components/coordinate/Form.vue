<template>
    <div>
        <a-form
            id="components-form-validate-other"
            :form="form"
            v-bind="formItemLayout"
            @submit="handleSubmit"
        >
            <a-form-item label="Image">
                <a-upload
                    v-decorator="['image']"
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
                                    required: true,
                                    message: 'Clothes item is required'
                                }
                            ]
                        }
                    ]"
                    style="width: 100%;"
                >
                    <a-empty v-if="!checkboxGroupItems.length" />
                    <a-row v-else>
                        <a-col :span="30">
                            <a-checkbox
                                v-for="(item, i) in checkboxGroupItems"
                                :key="i"
                                :value="item.key"
                                @change="() => onRemoveItemKey(item.key)"
                            >
                                <a-popover title="Clothes item">
                                    <template slot="content">
                                        <clothes-detail :item="item" />
                                    </template>
                                    <img
                                        class="selected-item-image"
                                        :src="item.imageLink"
                                    />
                                </a-popover>
                            </a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-form-item>

            <router-link
                v-if="!dataSource.length"
                :to="'/maintenance/clothes/new?next=back'"
            >
                Please create a clothes
            </router-link>
            <clothes-form-table
                :tableItems="tableItems"
                :selectedRowKeys="selectedRowKeys"
                v-on:on-select="onSelect"
            />

            <div class="form-submit-button">
                <a-button html-type="submit" type="primary">
                    Submit
                </a-button>
            </div>
        </a-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import {
    UploadingFileInfo,
    DoneUploadFileInfo
} from 'ant-design-vue/types/upload';

import ClothesDetail from '@/components/clothes/Detail.vue';
import ClothesFormTable from '@/components/clothes/FormTable.vue';
import { Coordinate } from '@/store/coordinate/type';
import { getBase64, isLt5M } from '@/util/file';
import { formItemLayout } from './form';
import { FormFields, Season, Record } from './type';

@Component({
    components: {
        ClothesDetail,
        ClothesFormTable
    }
})
export default class CoordinateForm extends Vue {
    $store!: Vuex.ExStore;

    readonly seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];

    @Prop({ type: Object as () => Coordinate })
    target?: Coordinate;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    imageLoading = false;

    selectedRowKeys: number[] = [];

    created() {
        const { target } = this;

        if (target) {
            const clothingIds = target.usedCoordinates.map(
                usedCoordinate => usedCoordinate.id
            );

            this.form = this.$form.createForm(this, {
                mapPropsToFields: () => {
                    return {
                        season: this.$form.createFormField({
                            value: target.season
                        }),
                        clothingIds: this.$form.createFormField({
                            value: clothingIds
                        })
                    };
                }
            });

            this.imageURL = target.imageLink || '';
            this.selectedRowKeys = clothingIds;
            return;
        }
        this.form = this.$form.createForm(this);
    }

    get tableItems() {
        return this.dataSource.filter(
            coordinateItem =>
                this.selectedRowKeys.indexOf(coordinateItem.key) === -1
        );
    }

    get checkboxGroupItems() {
        return this.dataSource.filter(
            coordinateItem =>
                this.selectedRowKeys.indexOf(coordinateItem.key) !== -1
        );
    }

    get dataSource() {
        const coordinateItems = this.$store.getters[
            'coordinate/coordinateItems'
        ];
        return coordinateItems.map(coordinateItem => ({
            key: coordinateItem.id,
            price: String(coordinateItem.price),
            imageLink: coordinateItem.imageLink,
            brandName: coordinateItem.brandName,
            shopName: coordinateItem.shopName,
            genres: coordinateItem.genres,
            buyDate: coordinateItem.buyDate,
            comment: coordinateItem.comment,
            satisfaction: coordinateItem.satisfaction
        })) as Record[];
    }

    @Emit('on-select')
    onSelect(key: number) {
        this.selectedRowKeys.push(key);
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
                            await this.$emit<FormFields>('on-register', values);
                        } catch (err) {
                            this.$emit('on-error', err);
                        }
                    },
                    onCancel() {}
                });
            }
        });
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
    width: 120px;
}

.selected-item-image {
    height: 180px;
    width: 150px;
    margin-bottom: 20px;
}

.select-item-table {
    padding-bottom: 20px;
}
</style>
