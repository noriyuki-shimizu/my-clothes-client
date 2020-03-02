<template>
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
                                message: 'Please input your email address'
                            }
                        ]
                    }
                ]"
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
                v-decorator="[
                    'password',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your Password'
                            }
                        ]
                    }
                ]"
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
        </a-form-item>
    </a-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { AppMessage } from 'ant-design-vue/types/message';

import { isFirebaseAuthError } from '@/plugins/firebase/auth';
import { resetMessage } from '@/util/reset';
import { FormFields } from './signInForm';
import { toHome } from './common';

@Component
export default class SignInForm extends Vue {
    form!: WrappedFormUtils;

    normalAuthMessage: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    beforeCreate() {
        this.form = this.$form.createForm(this);
    }

    handleSubmit(e: Event): void {
        e.preventDefault();
        this.normalAuthMessage = resetMessage();

        this.form.validateFields(async (err, values: FormFields) => {
            if (!err) {
                this.$emit<boolean>('set-loading', true);
                try {
                    await this.$store.dispatch(
                        'user/signInWithMailAddressAndPassword',
                        values
                    );
                    toHome(this.$route.params.again, this.$router);
                } catch (err) {
                    if ('config' in err) {
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
                    this.$emit<boolean>('set-loading', false);
                    this.form.resetFields();
                }
            }
        });
    }
}
</script>

<style scoped>
#components-form-normal-login .login-form {
    max-width: 300px;
}
#components-form-normal-login .login-form-button {
    width: 100%;
}
.normal-login-message {
    margin-top: 2%;
    margin-bottom: 5%;
}
</style>
