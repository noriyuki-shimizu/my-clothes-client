<template>
    <div id="sign_up">
        <a-spin id="sign_up_card" :spinning="spinning" size="large">
            <a-card title="Sign up" :bordered="false">
                <a-alert
                    class="registered-message"
                    v-if="registerMessage.isShow"
                    :message="registerMessage.text"
                    :description="registerMessage.description"
                    :type="registerMessage.type"
                    showIcon
                />
                <a-form :form="form" @submit="handleSubmit">
                    <a-form-item v-bind="formItemLayout" label="Name">
                        <a-input v-decorator="decorator.name" />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="Mail address">
                        <a-input v-decorator="decorator.mailAddress" />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="Password">
                        <a-input
                            v-decorator="decorator.password"
                            type="password"
                        />
                    </a-form-item>
                    <a-form-item
                        v-bind="formItemLayout"
                        label="Confirm Password"
                    >
                        <a-input
                            v-decorator="decorator.confirm"
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
                            Do you have an account?
                            <router-link to="/signIn">
                                Then sign in now!
                            </router-link>
                        </div>
                    </a-form-item>
                </a-form>
            </a-card>
        </a-spin>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {
    WrappedFormUtils,
    ValidationRule,
    FieldDecoratorOptions,
    Form,
    FieldDecorator
} from 'ant-design-vue/types/form/form';

import firebaseAuth, { isFirebaseAuthError } from '@/plugins/firebase/auth';
import { FirebaseExternalApiAuthError } from '@/plugins/firebase/auth/type';
import { AppMessage } from 'ant-design-vue/types/message';

type FormFields = {
    name: string;
    mailAddress: string;
    password: string;
    confirm: string;
};

interface HTMLElementEvent<T extends HTMLElement> extends Event {
    target: T;
}

@Component
export default class SignUn extends Vue {
    private form!: WrappedFormUtils;

    private confirmDirty = false;

    private spinning = false;

    private registerMessage: AppMessage = {
        isShow: false,
        text: '',
        description: '',
        type: null
    };

    private decorator: FieldDecorator = {
        name: [
            'name',
            {
                rules: [
                    {
                        required: true,
                        message: 'Please input your name!'
                    }
                ]
            }
        ],
        mailAddress: [
            'mailAddress',
            {
                rules: [
                    {
                        type: 'email',
                        message: 'The input is not valid mail address!'
                    },
                    {
                        required: true,
                        message: 'Please input your mail address!'
                    }
                ]
            }
        ],
        password: [
            'password',
            {
                rules: [
                    {
                        required: true,
                        message: 'Please input your password!'
                    },
                    {
                        validator: this.validateToNextPassword
                    }
                ]
            }
        ],
        confirm: [
            'confirm',
            {
                rules: [
                    {
                        required: true,
                        message: 'Please confirm your password!'
                    },
                    {
                        validator: this.compareToFirstPassword
                    }
                ]
            }
        ]
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
            callback('Two passwords that you enter is inconsistent!');
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
        this.registerMessage.isShow = false;

        this.form.validateFields(async (err, values: FormFields) => {
            if (!err) {
                this.spinning = true;
                try {
                    const { name, mailAddress, password } = values;
                    await firebaseAuth.createUserWithEmailAndPassword(
                        name,
                        mailAddress,
                        password
                    );
                    this.$router.push({ name: 'signIn' });
                } catch (err) {
                    if (isFirebaseAuthError(err)) {
                        this.registerMessage = {
                            isShow: true,
                            text: `Error (${err.code})`,
                            description: err.message,
                            type: 'error'
                        };
                    }
                    this.spinning = false;
                    this.form.resetFields();
                }
            }
        });
    }
}
</script>

<style scoped>
#sign_up {
    background-color: #ececec;
    padding: 5%;
    height: 100vh;
    width: 100vw;
}
#sign_up_card {
    width: 35vw;
    margin: auto;
}
#card_footer {
    margin-top: 10%;
}
#card_footer .login-form-button {
    width: 100%;
}
.registered-message {
    margin-bottom: 5%;
}
</style>
