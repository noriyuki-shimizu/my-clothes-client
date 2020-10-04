<template>
    <div>
        <a-form
            id="components-form-validate-other"
            :form="form"
            v-bind="formItemLayout"
            @submit="handleSubmit"
        >
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
                    <router-link
                        v-if="!coordinateItems.length"
                        :to="'/maintenance/clothes/new?next=back'"
                    >
                        {{ $t('message.info.empty-clothes') }}
                    </router-link>
                    <a-row v-else>
                        <a-col
                            :span="12"
                            v-for="item of coordinateItems"
                            :key="item.key"
                        >
                            <a-checkbox
                                class="selection-item"
                                :value="item.key"
                            >
                                <div v-if="isItemSelected(item.key)">
                                    <a-icon
                                        class="item-image-icon"
                                        type="check-circle"
                                        theme="twoTone"
                                        twoToneColor="#52c41a"
                                    />
                                    <img
                                        class="item-image item-selected"
                                        :src="item.imageLink"
                                    />
                                </div>
                                <div v-else>
                                    <img
                                        class="item-image"
                                        :src="item.imageLink"
                                    />
                                </div>
                            </a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-form-item>

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

import { Coordinate } from '@/store/coordinate/type';
import { getBase64, isLessThan5M } from '@/util/file';
import { ClothesItem } from '@/store/clothes/type';
import { formItemLayout, seasons } from './form';
import { FormFields, Season, Record } from './type';

@Component
export default class CoordinateMobileForm extends Vue {
    $store!: Vuex.ExStore;

    @Prop({ type: Object as () => Coordinate })
    target?: Coordinate;

    seasons = seasons;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    imageURL: string | ArrayBuffer | null = '';

    created() {
        this.fetchCoordinateItems();

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
        }
    }

    async fetchCoordinateItems() {
        await this.$store.dispatch('coordinate/fetchCoordinateItems');
    }

    get coordinateItems() {
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

    isItemSelected(key: number) {
        const clothingIds: number[] | undefined = this.form.getFieldValue(
            'clothingIds'
        );
        return clothingIds && clothingIds.indexOf(key) !== -1;
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

.ant-checkbox .ant-checkbox-inner {
    display: none;
}

.ant-checkbox-group {
    max-height: 450px;
    overflow: scroll;
}

.item-image-icon svg {
    position: absolute;
    top: 30px;
    left: 15px;
    font-size: 24px;
    z-index: 1;
}

.item-image {
    width: 150px;
}

.item-selected {
    opacity: 0.5;
}
</style>
