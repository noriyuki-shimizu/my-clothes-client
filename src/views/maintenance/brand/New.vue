<template>
    <div>
        <h1>Create brand</h1>
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
            <a-form-item v-bind="formItemLayout" label="Name">
                <a-input
                    v-decorator="decorator.name"
                    placeholder="Please enter brand name"
                />
            </a-form-item>

            <a-form-item label="Image">
                <a-upload
                    v-decorator="decorator.image"
                    name="image"
                    listType="picture-card"
                    class="image-uploader"
                    :showUploadList="false"
                    action="http://www.mocky.io/v2/5cc8019d300000980a055e76"
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

            <a-form-item v-bind="formItemLayout" label="Link">
                <a-input
                    v-decorator="decorator.link"
                    placeholder="Enter the link for the target brand"
                />
            </a-form-item>

            <a-form-item v-bind="formItemLayout" label="Country">
                <a-input
                    v-decorator="decorator.country"
                    placeholder="Enter the country for the target brand"
                />
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
import { Vue, Component } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
import * as Vuex from 'vuex';
import {
    WrappedFormUtils,
    FieldDecorator
} from 'ant-design-vue/types/form/form';
import {
    UploadingFileInfo,
    DoneUploadFileInfo
} from 'ant-design-vue/types/upload';
import { isAxiosError } from '../../../plugins/api';

type FormFields = {
    name: string;
    image: DoneUploadFileInfo;
    link: string;
    country: string;
};

type Message = {
    isShow: boolean;
    text: string;
    description: string;
    type: 'warning' | 'error' | null;
};

type ExPartial<T> = { [P in keyof T]?: Partial<T[P]> | undefined };

const getBase64 = (
    img: File,
    callback: (imageURL: string | ArrayBuffer | null) => void
) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

@Component
export default class New extends Vue {
    form!: WrappedFormUtils;

    imageURL: string | ArrayBuffer | null = '';

    imageLoading = false;

    decorator: FieldDecorator = {
        name: [
            'name',
            {
                rules: [
                    {
                        max: 60,
                        message: 'Name cannot be longer than 60 characters!'
                    },
                    {
                        required: true,
                        message: 'Please input your name!'
                    }
                ]
            }
        ],
        image: ['image', {}],
        link: [
            'link',
            {
                rules: [
                    {
                        max: 100,
                        message: 'Link cannot be longer than 100 characters!'
                    }
                ]
            }
        ],
        country: [
            'country',
            {
                rules: [
                    {
                        max: 15,
                        message: 'Country cannot be longer than 15 characters!'
                    },
                    {
                        required: true,
                        message: 'Please input your country!'
                    }
                ]
            }
        ]
    };

    formItemLayout: Readonly<ExPartial<Form>> = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    };

    message: Message = {
        isShow: false,
        text: '',
        description: '',
        type: null
    };

    $store!: Vuex.ExStore;

    created() {
        this.form = this.$form.createForm(this);
    }

    beforeUpload(file: File) {
        const isLt5M = file.size < 5 * 1024 * 1024;
        if (!isLt5M) {
            this.$message.error('Image must smaller than 2MB!');
        }
        return isLt5M;
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

    async onCreateBrand(values: FormFields) {
        try {
            const { name, image, link, country } = values;
            const imageFile =
                image && image.file ? image.file.originFileObj : null;

            await this.$store.dispatch('brand/onAddBrand', {
                brand: {
                    name,
                    link,
                    country
                },
                imageFile
            });

            this.$success({
                title: 'Create success 👏',
                onOk: () => {
                    this.$router.push({ name: 'brand' });
                }
            });
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response && err.response.status === 403) {
                    const { $store, $router } = this;
                    this.$warning({
                        title: 'Certification expired',
                        content: 'Please sign in again.',
                        onOk: () => {
                            $store.dispatch('user/signOut');
                            $router.push({ name: 'signIn' });
                        }
                    });
                    return;
                }
                this.message = {
                    isShow: true,
                    text: `Error (${err.message})`,
                    description: `Access URL: ${err.config.url}`,
                    type: 'error'
                };
            }
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
                        await this.onCreateBrand(values);
                    },
                    onCancel() {}
                });
            }
        });
    }
}
</script>

<style>
.alert-message {
    margin-bottom: 20px;
}

#components-form-validate-other .dropbox {
    height: 180px;
    line-height: 1.5;
}

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
