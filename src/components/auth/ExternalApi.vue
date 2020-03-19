<template>
    <a-spin id="external_api" :spinning="spinning" size="large">
        <a-alert
            class="external-api-login-message"
            v-if="externalApiAuthMessage.isShow"
            :message="externalApiAuthMessage.text"
            :description="externalApiAuthMessage.description"
            :type="externalApiAuthMessage.type"
            showIcon
        />
        <a-button
            icon="google"
            class="external-api-login-button"
            id="google_login_button"
            @click="signInWithGoogle"
        >
            Signin with Google
        </a-button>
        <a-button
            icon="twitter"
            class="external-api-login-button"
            id="twitter_login_button"
            @click="signInWithTwitter"
        >
            Signin with Twitter
        </a-button>
        <a-button
            icon="facebook"
            class="external-api-login-button"
            id="facebook_login_button"
            @click="signInWithFacebook"
        >
            Signin with Facebook
        </a-button>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { FirebaseExternalApiAuthError } from 'firebase';
import { AppMessage } from 'ant-design-vue/types/message';

import { isFirebaseExternalApiAuthError } from '@/plugins/firebase/auth';
import { resetMessage } from '@/util/reset';
import { toHome, mappingMessage } from './externalApi';

@Component
export default class SignIn extends Vue {
    spinning = false;

    externalApiAuthMessage: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    async signInWithGoogle(): Promise<void> {
        this.externalApiAuthMessage = resetMessage();
        this.spinning = true;

        try {
            await this.$store.dispatch('user/signInWithGoogle');
            toHome(this.$route.params.again, this.$router);
        } catch (err) {
            if (isFirebaseExternalApiAuthError(err)) {
                this.spinning = false;
                this.externalApiAuthMessage = mappingMessage(err);
            }
        }
    }

    async signInWithTwitter(): Promise<void> {
        // TODO: Twitter 側の設定を更新したら、以下のコメントアウトを外す
        // this.externalApiAuthMessage = resetMessage();
        // this.spinning = true;
        //
        // try {
        //     await this.$store.dispatch('user/signInWithTwitter');
        //     toHome(this.$route.params.again, this.$router);
        // } catch (err) {
        //     if (isFirebaseExternalApiAuthError(err)) {
        //         this.spinning = false;
        //         this.externalApiAuthMessage = mappingMessage(err);
        //     }
        // }
    }

    async signInWithFacebook(): Promise<void> {
        this.externalApiAuthMessage = resetMessage();
        this.spinning = true;

        try {
            await this.$store.dispatch('user/signInWithFacebook');
            toHome(this.$route.params.again, this.$router);
        } catch (err) {
            if (isFirebaseExternalApiAuthError(err)) {
                this.spinning = false;
                this.externalApiAuthMessage = mappingMessage(err);
            }
        }
    }
}
</script>

<style scoped>
#external_api {
    text-align: center;
    width: 50vw;
    margin: auto;
}
.external-api-login-button {
    margin-top: 2%;
    margin-bottom: 2%;
    color: white;
    height: 7vh;
    width: 45vw;
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
