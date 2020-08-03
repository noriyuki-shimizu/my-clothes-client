<template>
    <div>
        <a-drawer
            :title="$t('title.accout-setting')"
            :width="'calc(25rem + (2vw - 1.2rem) * 2)'"
            :visible="visible"
            @close="onInputResetAndClose"
            :wrapStyle="{
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
                <a-form-item :label="$t('dictionary.user.mail-address')">
                    <span class="ant-form-text">
                        {{ currentUser ? currentUser.email : '' }}
                    </span>
                </a-form-item>

                <a-form-item
                    v-bind="formItemLayout"
                    :label="$t('dictionary.user.name')"
                >
                    <a-input
                        v-decorator="[
                            'displayName',
                            {
                                rules: [
                                    {
                                        max: 30,
                                        message:
                                            'Name cannot be longer than 30 characters'
                                    }
                                ]
                            }
                        ]"
                        placeholder="Please enter user name"
                    />
                </a-form-item>

                <a-form-item :label="$t('dictionary.user.icon')">
                    <a-upload
                        v-decorator="['icon', {}]"
                        name="icon"
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

                <div class="form-submit-button">
                    <a-button
                        :style="{ marginRight: '8px' }"
                        @click="onInputResetAndClose"
                    >
                        {{ $t('operation.cancel') }}
                    </a-button>
                    <a-button
                        html-type="submit"
                        type="primary"
                        :loading="registerLoading"
                    >
                        {{ $t('operation.submit') }}
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
import { isFirebaseStorageError } from '@/plugins/firebase/storage';
import { formItemLayout } from './form';

type FormFields = {
    displayName: string;
    icon: DoneUploadFileInfo;
};

@Component
export default class AccountSetting extends Vue {
    form!: WrappedFormUtils;

    registerLoading = false;

    imageURL: string | ArrayBuffer | null = '';

    $store!: Vuex.ExStore;

    @Prop({ type: Boolean, required: true })
    visible!: boolean;

    formItemLayout = formItemLayout;

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

    setSelectImage(file: any) {
        var fileReader = new FileReader();
        fileReader.onload = () => {
            this.imageURL = fileReader.result;
        };
        fileReader.readAsDataURL(file.file);
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

    onInputResetAndClose() {
        const user = this.currentUser as firebase.User;
        this.form.setFieldsValue({
            displayName: user.displayName,
            icon: null
        });
        this.imageURL = user.photoURL || '';

        this.$emit('on-close');
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

                    this.$message.success(
                        this.$t('message.success.update-complete').toString()
                    );
                    this.$emit('on-close');
                } catch (err) {
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
@import '../../assets/css/form/ant.css';
</style>
