<template>
    <div>
        <a-form
            id="components-form-validate-other"
            :form="form"
            v-bind="formItemLayout"
            @submit="handleSubmit"
        >
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
                    <router-link
                        v-if="!coordinateItems.length"
                        :to="'/maintenance/clothes/new?next=back'"
                    >
                        Please create a clothes
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

import { Coordinate } from '@/store/coordinate/type';
import { getBase64, isLt5M } from '@/util/file';
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

    imageLoading = false;

    created() {
        this.fetchCoordinateItems();
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
            return;
        }
        this.form = this.$form.createForm(this);
    }

    async fetchCoordinateItems() {
        await this.$store.dispatch('coordinate/fetchCoordinateItems');
    }

    get coordinateItems() {
        const coordinateItems = this.$store.getters[
            'coordinate/coordinateItems'
        ];

        return coordinateItems.map(coordinateItem => {
            const { id, price, ...items } = coordinateItem;
            return {
                key: coordinateItem.id,
                price: String(coordinateItem.price),
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
                this.$emit<FormFields>('on-submit', values);
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
