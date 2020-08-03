<template>
    <div>
        <a-form
            id="components-form-validate-other"
            :form="form"
            v-bind="formItemLayout"
            @submit="handleSubmit"
        >
            <a-form-item :label="$t('dictionary.image')">
                <a-upload
                    v-decorator="[
                        'image',
                        {
                            rules: [
                                {
                                    required: !this.target,
                                    message: $t(
                                        'message.validation.image.required'
                                    )
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
                        <a-icon type="plus" />
                        <div class="ant-upload-text">
                            {{ $t('operation.select') }}
                        </div>
                    </div>
                </a-upload>
            </a-form-item>

            <a-form-item
                v-bind="formItemLayout"
                :label="$t('dictionary.season.index')"
            >
                <a-select
                    v-decorator="[
                        'season',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: $t(
                                        'message.validation.coordinate.season.required'
                                    )
                                }
                            ]
                        }
                    ]"
                >
                    <a-select-option
                        v-for="season in seasons"
                        :key="season"
                        :value="season"
                    >
                        {{ $t(season) }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item
                v-bind="formItemLayout"
                :label="$t('dictionary.coordinate.item')"
            >
                <a-checkbox-group
                    v-decorator="[
                        'clothingIds',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: $t(
                                        'message.validation.coordinate.item.required'
                                    )
                                }
                            ]
                        }
                    ]"
                    style="width: 100%;"
                >
                    <a-empty
                        v-if="!checkboxGroupItems.length"
                        :description="false"
                    >
                        {{ $t('dictionary.empty') }}
                    </a-empty>
                    <a-row v-else>
                        <a-col :span="30">
                            <a-checkbox
                                v-for="(item, i) in checkboxGroupItems"
                                :key="i"
                                :value="item.key"
                                @change="() => onRemoveItemKey(item.key)"
                            >
                                <a-popover
                                    :title="
                                        `${$t(
                                            'dictionary.coordinate.item'
                                        )}${i + 1}`
                                    "
                                >
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
                {{ $t('message.info.empty-clothes') }}
            </router-link>
            <clothes-form-table
                :tableItems="tableItems"
                :selectedRowKeys="selectedRowKeys"
                v-on:on-select="onSelect"
            />

            <div class="form-submit-button">
                <a-button html-type="submit" type="primary">
                    {{ $t('operation.submit') }}
                </a-button>
            </div>
        </a-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
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
import { ClothesItem } from '@/store/clothes/type';
import { formItemLayout, seasons } from './form';
import { FormFields, Season, Record } from './type';

@Component({
    components: {
        ClothesDetail,
        ClothesFormTable
    }
})
export default class CoordinateForm extends Vue {
    $store!: Vuex.ExStore;

    seasons = seasons;

    @Prop({ type: Object as () => Coordinate })
    target?: Coordinate;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    selectedRowKeys: number[] = [];

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
    onTargetChange(newCoordinate: Coordinate) {
        if (newCoordinate) {
            const clothingIds = newCoordinate.usedCoordinates.map(
                usedCoordinate => usedCoordinate.id
            );

            this.form.setFieldsValue({
                season: newCoordinate.season,
                clothingIds
            });

            this.imageURL = newCoordinate.imageLink || '';
            this.selectedRowKeys = clothingIds;
        }
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

        return coordinateItems.map((coordinateItem: ClothesItem) => {
            const { id, ...items } = coordinateItem;
            return {
                key: coordinateItem.id,
                ...items
            };
        }) as Record[];
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

.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}

.selected-item-image {
    height: 160px;
    max-width: 140px;
    margin-bottom: 20px;
}
</style>
