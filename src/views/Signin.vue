<template>
    <div id="sign_in">
        <a-spin id="sign_in_card" :spinning="spinning" size="large">
            <a-card title="Sign in" :bordered="false">
                <a-alert
                    class="external-api-login-message"
                    v-if="externalApiAuthMessage.isShow"
                    :message="externalApiAuthMessage.text"
                    :description="externalApiAuthMessage.description"
                    :type="externalApiAuthMessage.type"
                    showIcon
                />
                <a-button
                    icon="github"
                    shape="round"
                    class="external-api-login-button"
                    id="github_login_button"
                    @click="signInWithGithub"
                >
                    Log in for Github
                </a-button>
                <a-button
                    icon="google"
                    shape="round"
                    class="external-api-login-button"
                    id="google_login_button"
                    @click="signInWithGoogle"
                >
                    Log in for Google
                </a-button>
                <a-divider />
                <a-form
                    id="components-form-normal-login"
                    :form="form"
                    class="login-form"
                    @submit="handleSubmit"
                >
                    <a-alert
                        class="normal-login-message"
                        v-if="normalAuthMessage.isShow"
                        :message="normalAuthMessage.text"
                        :description="normalAuthMessage.description"
                        :type="normalAuthMessage.type"
                        showIcon
                    />
                    <a-form-item>
                        <a-input
                            v-decorator="decorator.mailAddress"
                            placeholder="Mail address"
                        >
                            <a-icon
                                slot="prefix"
                                type="mail"
                                style="color: rgba(0,0,0,.25)"
                            />
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-input
                            v-decorator="decorator.password"
                            type="password"
                            placeholder="Password"
                        >
                            <a-icon
                                slot="prefix"
                                type="lock"
                                style="color: rgba(0,0,0,.25)"
                            />
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            class="login-form-button"
                        >
                            Log in
                        </a-button>
                        Or
                        <router-link to="/signUp">
                            register now!
                        </router-link>
                        <a class="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </a-form-item>
                </a-form>
            </a-card>
        </a-spin>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import {
    FieldDecoratorOptions,
    WrappedFormUtils,
    FieldDecorator
} from 'ant-design-vue/types/form/form';

import {
    isFirebaseAuthError,
    isFirebaseExternalApiAuthError
} from '@/plugins/firebase/auth';
import { FirebaseExternalApiAuthError } from '@/plugins/firebase/auth/type';
import { isAxiosError } from '../plugins/api';

type FormFields = {
    mailAddress: string;
    password: string;
};

type Message = {
    isShow: boolean;
    text: string;
    description: string;
    type: 'warning' | 'error' | null;
};

@Component
export default class SignIn extends Vue {
    private form!: WrappedFormUtils;

    private spinning = false;

    private externalApiAuthMessage: Message = {
        isShow: false,
        text: '',
        description: '',
        type: null
    };

    private normalAuthMessage: Message = {
        isShow: false,
        text: '',
        description: '',
        type: null
    };

    private decorator: FieldDecorator = {
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
                        message: 'Please input your email address!'
                    }
                ]
            }
        ],
        password: [
            'password',
            {
                rules: [
                    { required: true, message: 'Please input your Password!' }
                ]
            }
        ]
    };

    $store!: Vuex.ExStore;

    beforeCreate() {
        this.form = this.$form.createForm(this);
    }

    private mappingMessage(err: FirebaseExternalApiAuthError): Message {
        return {
            isShow: true,
            text: `Error (${err.code})`,
            description: `${err.message} ProviderId is "${err.credential.providerId}", Email is "${err.email}"`,
            type: 'error'
        };
    }

    private toHome(): void {
        this.$router.push({ name: 'home' });
    }

    async signInWithGithub(): Promise<void> {
        this.externalApiAuthMessage.isShow = false;
        this.normalAuthMessage.isShow = false;
        this.spinning = true;

        try {
            await this.$store.dispatch('user/signInWithGithub');
            this.toHome();
        } catch (err) {
            if (isFirebaseExternalApiAuthError(err)) {
                this.spinning = false;
                this.externalApiAuthMessage = this.mappingMessage(err);
            }
        }
    }

    async signInWithGoogle(): Promise<void> {
        this.externalApiAuthMessage.isShow = false;
        this.normalAuthMessage.isShow = false;
        this.spinning = true;

        try {
            await this.$store.dispatch('user/signInWithGoogle');
            this.toHome();
        } catch (err) {
            if (isFirebaseExternalApiAuthError(err)) {
                this.spinning = false;
                this.externalApiAuthMessage = this.mappingMessage(err);
            }
        }
    }

    handleSubmit(e: Event): void {
        e.preventDefault();
        this.externalApiAuthMessage.isShow = false;
        this.normalAuthMessage.isShow = false;

        this.form.validateFields(async (err: Error[], values: FormFields) => {
            if (!err) {
                this.spinning = true;
                try {
                    await this.$store.dispatch(
                        'user/signInWithMailAddressAndPassword',
                        values
                    );
                    this.toHome();
                } catch (err) {
                    if (isAxiosError(err)) {
                        this.normalAuthMessage = {
                            isShow: true,
                            text: `Error (${err.message})`,
                            description: `Access URL: ${err.config.url}`,
                            type: 'error'
                        };
                    }
                    if (isFirebaseAuthError(err)) {
                        this.normalAuthMessage = {
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
#sign_in {
    background-color: #ececec;
    padding: 5%;
    height: 100vh;
    width: 100vw;
}
#sign_in_card {
    width: 30vw;
    margin: auto;
}
#components-form-normal-login .login-form {
    max-width: 300px;
}
#components-form-normal-login .login-form-forgot {
    float: right;
}
#components-form-normal-login .login-form-button {
    width: 100%;
}
.external-api-login-button {
    margin-top: 2%;
    margin-bottom: 2%;
    color: white;
    height: 6vh;
    width: 100%;
}
#github_login_button {
    background-color: black;
}
#google_login_button {
    background-color: blue;
}
.external-api-login-message {
    margin-top: 2%;
    margin-bottom: 2%;
}
.normal-login-message {
    margin-top: 2%;
    margin-bottom: 4%;
}
</style>
