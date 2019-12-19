<template>
    <div id="signin">
        <a-spin id="signin_card" :spinning="spinning" size="large">
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
                    @click="signinWithGithub"
                >
                    Log in for Github
                </a-button>
                <a-button
                    icon="google"
                    shape="round"
                    class="external-api-login-button"
                    id="google_login_button"
                    @click="signinWithGoogle"
                >
                    Log in for Google
                </a-button>
                <a-divider />
                <a-form
                    id="components-form-demo-normal-login"
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
                        <div id="card_footer">
                            <a-button
                                type="primary"
                                html-type="submit"
                                class="login-form-button"
                                :disabled="hasErrors(form.getFieldsError())"
                            >
                                Log in
                            </a-button>
                            Or
                            <router-link to="/signup">
                                register now!
                            </router-link>
                            <a class="login-form-forgot" href="">
                                Forgot password
                            </a>
                        </div>
                    </a-form-item>
                </a-form>
            </a-card>
        </a-spin>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';

import firebaseAuth, {
    isFirebaseNormalAuthError,
    isFirebaseExternalApiAuthError
} from '@/plugins/firebase/auth';
import { FirebaseExternalApiAuthError } from '@/plugins/firebase/auth/type';
import { Decorator } from '@/views/decorator';

type FormFields = {
    mailAddress: string;
    password: string;
};

type FormValidateFields = {
    [k: string]: string;
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
export default class Signin extends Vue {
    private form: any;

    private spinning: boolean = false;

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

    private decorator: Decorator.FieldParameters = {
        mailAddress: [
            'mailAddress',
            {
                rules: [
                    {
                        type: 'email',
                        message: 'Please enter the correct email address!'
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

    private goHome(): void {
        this.$router.push({ name: 'home' });
    }

    async signinWithGithub(): Promise<void> {
        this.externalApiAuthMessage.isShow = false;
        this.normalAuthMessage.isShow = false;
        this.spinning = true;

        try {
            await this.$store.dispatch('user/signinWithGithub');
            this.goHome();
        } catch (err) {
            if (isFirebaseExternalApiAuthError(err)) {
                this.spinning = false;
                this.externalApiAuthMessage = this.mappingMessage(err);
            }
        }
    }

    async signinWithGoogle(): Promise<void> {
        this.externalApiAuthMessage.isShow = false;
        this.normalAuthMessage.isShow = false;
        this.spinning = true;

        try {
            await this.$store.dispatch('user/signinWithGoogle');
            this.goHome();
        } catch (err) {
            console.log(err);
            if (isFirebaseExternalApiAuthError(err)) {
                this.spinning = false;
                this.externalApiAuthMessage = this.mappingMessage(err);
            }
        }
    }

    hasErrors(formValidateField: FormValidateFields): boolean {
        return Object.keys(formValidateField).some(
            field => formValidateField[field]
        );
    }

    handleSubmit(e: Event): void {
        e.preventDefault();
        this.externalApiAuthMessage.isShow = false;
        this.normalAuthMessage.isShow = false;
        this.spinning = true;

        this.form.validateFields(async (err: any, values: FormFields) => {
            if (!err) {
                try {
                    await this.$store.dispatch(
                        'user/signinWithMailAddressAndPassword',
                        values
                    );
                    this.goHome();
                } catch (err) {
                    if (isFirebaseNormalAuthError(err)) {
                        this.spinning = false;
                        this.normalAuthMessage = {
                            isShow: true,
                            text: `Error (${err.code})`,
                            description: err.message,
                            type: 'error'
                        };
                        this.form.resetFields();
                    }
                }
            }
        });
    }
}
</script>

<style>
#signin {
    background-color: #ececec;
    padding: 5%;
    height: 100vh;
    width: 100vw;
}
#signin_card {
    width: 35vw;
    margin: auto;
}
#components-form-demo-normal-login .login-form {
    max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
    float: right;
}
#components-form-demo-normal-login .login-form-button {
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
#card_footer {
    bottom: 0;
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
