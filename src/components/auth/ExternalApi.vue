<template>
    <a-spin id="external_api" :spinning="spinning" size="large">
        <a-alert
            class="external-api-login-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />
        <a-button
            icon="google"
            class="external-api-login-button"
            id="google_login_button"
            @click="signInWithGoogle"
        >
            {{ $t('dictionary.authentication.external.with-google') }}
        </a-button>
        <a-button
            icon="twitter"
            class="external-api-login-button"
            id="twitter_login_button"
            @click="signInWithTwitter"
        >
            {{ $t('dictionary.authentication.external.with-twitter') }}
        </a-button>
        <a-button
            icon="facebook"
            class="external-api-login-button"
            id="facebook_login_button"
            @click="signInWithFacebook"
        >
            {{ $t('dictionary.authentication.external.with-facebook') }}
        </a-button>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { FirebaseExternalApiAuthError } from 'firebase';
import { AppMessage } from 'ant-design-vue/types/message';

import { isFirebaseExternalApiAuthError } from '@/plugins/firebase/auth';
import {
    resetMessage,
    toErrorMessage,
    toFirebaseErrorMessage
} from '@/util/message';
import { toHome } from './externalApi';

@Component
export default class SignIn extends Vue {
    spinning = false;

    message: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    async signInWithGoogle(): Promise<void> {
        this.message = resetMessage();
        this.spinning = true;

        await this.$store
            .dispatch('user/signInWithGoogle')
            .catch((err: any) => {
                this.spinning = false;
                this.message = isFirebaseExternalApiAuthError(err)
                    ? toFirebaseErrorMessage(err)
                    : toErrorMessage(err);
            });

        toHome(this.$route.query.next, this.$router);
    }

    async signInWithTwitter(): Promise<void> {
        this.message = resetMessage();
        this.spinning = true;

        await this.$store
            .dispatch('user/signInWithTwitter')
            .catch((err: any) => {
                this.spinning = false;
                this.message = isFirebaseExternalApiAuthError(err)
                    ? toFirebaseErrorMessage(err)
                    : toErrorMessage(err);
            });

        toHome(this.$route.query.next, this.$router);
    }

    async signInWithFacebook(): Promise<void> {
        this.message = resetMessage();
        this.spinning = true;

        await this.$store
            .dispatch('user/signInWithFacebook')
            .catch((err: any) => {
                this.spinning = false;
                this.message = isFirebaseExternalApiAuthError(err)
                    ? toFirebaseErrorMessage(err)
                    : toErrorMessage(err);
            });

        toHome(this.$route.query.next, this.$router);
    }
}
</script>

<style scoped>
#external_api {
    text-align: center;
    width: calc(24rem + (18vw - 17rem));
    margin: auto;
}
.external-api-login-button {
    margin-top: 2%;
    margin-bottom: 2%;
    color: white;
    height: 4rem;
    width: 100%;
    font-size: calc(1.6rem + (1vw - 1rem));
}
#google_login_button {
    background-color: #c6594b;
    border-color: #a94335;
}
#twitter_login_button {
    background-color: #55acee;
    border-color: #2795e9;
}
#facebook_login_button {
    background-color: #4267b2;
    border-color: #29487d;
}
.external-api-login-message {
    margin-top: 2%;
    margin-bottom: 4%;
}
</style>
