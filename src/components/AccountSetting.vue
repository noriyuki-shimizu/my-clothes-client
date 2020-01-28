<template>
    <div>
        <a-drawer
            title="Your account setting"
            :width="600"
            :visible="visible"
            @close="onInputResetAndClose"
            :wrapStyle="{
                height: 'calc(100% - 108px)',
                overflow: 'auto',
                paddingBottom: '108px'
            }"
        >
            <a-form
                :form="form"
                v-bind="formItemLayout"
                @submit="handleSubmit"
                hideRequiredMark
            >
                <a-form-item label="Mail address">
                    <span class="ant-form-text">
                        {{ currentUser ? currentUser.email : '' }}
                    </span>
                </a-form-item>

                <a-form-item v-bind="formItemLayout" label="Name">
                    <a-input
                        v-decorator="decorator.displayName"
                        placeholder="Please enter user name"
                    />
                </a-form-item>

                <a-form-item label="Icon">
                    <a-upload
                        v-decorator="decorator.icon"
                        name="icon"
                        listType="picture-card"
                        class="icon-uploader"
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

                <div class="form-submit-button">
                    <a-button
                        :style="{ marginRight: '8px' }"
                        @click="onInputResetAndClose"
                    >
                        Cancel
                    </a-button>
                    <a-button
                        html-type="submit"
                        type="primary"
                        :loading="registerLoading"
                    >
                        Submit
                    </a-button>
                </div>
            </a-form>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import {
    WrappedFormUtils,
    FieldDecoratorOptions,
    Form,
    FieldDecorator
} from 'ant-design-vue/types/form/form';
import {
    ExUploadFile,
    UploadingFileInfo,
    DoneUploadFileInfo
} from 'ant-design-vue/types/upload';

import { getBase64, isLt5M } from '@/util/file';
import { isFirebaseStorageError } from '../plugins/firebase/auth';

type FormFields = {
    displayName: string;
    icon: DoneUploadFileInfo;
};

@Component
export default class AccountSetting extends Vue {
    private form!: WrappedFormUtils;

    private imageLoading = false;

    private registerLoading = false;

    private imageURL: string | ArrayBuffer | null = '';

    $store!: Vuex.ExStore;

    @Prop({ type: Boolean, required: true })
    visible!: boolean;

    private decorator: FieldDecorator = {
        displayName: [
            'displayName',
            {
                rules: [
                    {
                        max: 30,
                        message: 'Name cannot be longer than 30 characters'
                    }
                ]
            }
        ],
        icon: ['icon', {}]
    };

    private formItemLayout: Readonly<ExPartial<Form>> = {
        labelCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 8, offset: 0 }
        },
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 0 }
        }
    };

    created() {
        const user = this.currentUser as firebase.User;
        this.form = this.$form.createForm(this, {
            mapPropsToFields: () => {
                return {
                    displayName: this.$form.createFormField({
                        value: user.displayName
                    })
                };
            }
        });
        this.imageURL = user.photoURL || '';
    }

    get currentUser() {
        return this.$store.getters['user/currentUser'];
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

    beforeUpload(file: File) {
        const isBeforeCheck = isLt5M(file);
        if (!isBeforeCheck) {
            this.$message.error('Image must smaller than 2MB');
        }
        return isBeforeCheck;
    }

    onInputResetAndClose() {
        const user = this.currentUser as firebase.User;
        this.form.setFieldsValue({
            displayName: user.displayName,
            icon: null
        });
        this.imageURL = user.photoURL || '';

        this.$emit('onClose');
    }

    handleSubmit(e: Event) {
        this.registerLoading = true;
        e.preventDefault();

        this.form.validateFieldsAndScroll(async (err, values: FormFields) => {
            if (!err) {
                try {
                    const { displayName, icon } = values;
                    const iconFile =
                        icon && icon.file ? icon.file.originFileObj : null;

                    await this.$store.dispatch('user/updateProfile', {
                        displayName,
                        iconFile
                    });
                    this.$message.success('Successfully updated account');
                    this.$emit('onClose');
                } catch (err) {
                    console.log(err);
                    if (isFirebaseStorageError(err)) {
                        this.$message.error(err.message);
                    }
                }
            }
            this.registerLoading = false;
        });
    }
}
</script>

<style scoped>
#preview_image {
    width: 124px;
    height: 124px;
}

.icon-uploader > .ant-upload {
    width: 128px;
    height: 128px;
}

.form-submit-button {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
}
</style>
