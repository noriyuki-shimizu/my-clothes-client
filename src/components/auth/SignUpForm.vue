<template>
    <a-form :form="form" @submit="handleSubmit">
        <a-form-item v-bind="formItemLayout" label="Name">
            <a-input
                v-decorator="[
                    'name',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your name'
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Mail address">
            <a-input
                v-decorator="[
                    'mailAddress',
                    {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid mail address'
                            },
                            {
                                required: true,
                                message: 'Please input your mail address'
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Password">
            <a-input-password
                v-decorator="[
                    'password',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password'
                            },
                            {
                                validator: this.validateToNextPassword
                            }
                        ]
                    }
                ]"
                type="password"
            />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="Confirm Password">
            <a-input-password
                v-decorator="[
                    'confirm',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password'
                            },
                            {
                                validator: this.compareToFirstPassword
                            }
                        ]
                    }
                ]"
                type="password"
                @blur="handleConfirmBlur"
            />
        </a-form-item>
        <a-form-item>
            <div id="card_footer">
                <a-button
                    type="primary"
                    html-type="submit"
                    class="login-form-button"
                >
                    Register
                </a-button>
            </div>
        </a-form-item>
    </a-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {
    WrappedFormUtils,
    ValidationRule,
    Form,
    FieldDecorator
} from 'ant-design-vue/types/form/form';

import firebaseAuth, { isFirebaseAuthError } from '@/plugins/firebase/auth';
import { AppMessage } from 'ant-design-vue/types/message';
import { resetMessage } from '@/util/reset';
import { HTMLElementEvent, FormFields } from './signUpForm';

@Component
export default class SignUn extends Vue {
    form!: WrappedFormUtils;

    confirmDirty = false;

    formItemLayout: Readonly<ExPartial<Form>> = {
        labelCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 8, offset: 0 }
        },
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 0 }
        }
    };

    beforeCreate() {
        this.form = this.$form.createForm(this);
    }

    handleConfirmBlur(e: HTMLElementEvent<HTMLInputElement>): void {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
    }

    compareToFirstPassword(
        rule: ValidationRule,
        value: any,
        callback: Function
    ): void {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent');
        } else {
            callback();
        }
    }

    validateToNextPassword(
        rule: ValidationRule,
        value: any,
        callback: Function
    ): void {
        const form = this.form;
        if (value && this.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleSubmit(e: Event): void {
        e.preventDefault();
        this.$emit<AppMessage>('set-message', resetMessage());

        this.form.validateFields(async (err, values: FormFields) => {
            if (!err) {
                this.$emit<boolean>('set-loading', true);
                try {
                    const { name, mailAddress, password } = values;
                    await firebaseAuth.createUserWithEmailAndPassword(
                        name,
                        mailAddress,
                        password
                    );

                    this.$success({
                        title: 'Account created 👏',
                        onOk: () => {
                            this.$router.push({ name: 'signIn' });
                        }
                    });
                } catch (err) {
                    if (isFirebaseAuthError(err)) {
                        this.$emit<AppMessage>('set-message', {
                            isShow: true,
                            text: `Error (${err.code})`,
                            description: err.message,
                            type: 'error'
                        });
                    }
                    this.$emit<boolean>('set-loading', false);
                    this.form.resetFields();
                }
            }
        });
    }
}
</script>

<style scoped>
#card_footer {
    margin-top: 5%;
}
#card_footer .login-form-button {
    width: 100%;
}
</style>
