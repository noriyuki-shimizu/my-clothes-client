<template>
    <div>
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
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { FirebaseExternalApiAuthError } from 'firebase';
import { AppMessage } from 'ant-design-vue/types/message';

import { isFirebaseExternalApiAuthError } from '@/plugins/firebase/auth';
import { resetMessage } from '@/util/reset';
import { mappingMessage } from './externalApi';
import { toHome } from './common';

@Component
export default class SignIn extends Vue {
    externalApiAuthMessage: AppMessage = resetMessage();

    $store!: Vuex.ExStore;

    async signInWithGithub(): Promise<void> {
        this.externalApiAuthMessage = resetMessage();
        this.$emit<boolean>('set-loading', true);

        try {
            await this.$store.dispatch('user/signInWithGithub');
            toHome(this.$route.params.again, this.$router);
        } catch (err) {
            if (isFirebaseExternalApiAuthError(err)) {
                this.$emit<boolean>('set-loading', false);
                this.externalApiAuthMessage = mappingMessage(err);
            }
        }
    }

    async signInWithGoogle(): Promise<void> {
        this.externalApiAuthMessage = resetMessage();
        this.$emit<boolean>('set-loading', true);

        try {
            await this.$store.dispatch('user/signInWithGoogle');
            toHome(this.$route.params.again, this.$router);
        } catch (err) {
            if (isFirebaseExternalApiAuthError(err)) {
                this.$emit<boolean>('set-loading', false);
                this.externalApiAuthMessage = mappingMessage(err);
            }
        }
    }
}
</script>

<style scoped>
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
    margin-bottom: 4%;
}
</style>
