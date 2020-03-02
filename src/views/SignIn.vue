<template>
    <div id="sign_in">
        <a-spin id="sign_in_card" :spinning="spinning" size="large">
            <a-card title="Sign in" :bordered="false">
                <ExternalApi v-on:set-loading="setLoading" />
                <SignInForm v-on:set-loading="setLoading" />
                Or
                <router-link to="/sign-up">
                    register now!
                </router-link>
                <router-link class="login-form-forgot" to="/reset-password">
                    Forgot password
                </router-link>
            </a-card>
        </a-spin>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';

import SignInForm from '@/components/auth/SignInForm.vue';
import ExternalApi from '@/components/auth/ExternalApi.vue';

@Component({
    components: {
        SignInForm,
        ExternalApi
    }
})
export default class SignIn extends Vue {
    spinning = false;

    @Emit('set-loading')
    setLoading(spinning: boolean) {
        this.spinning = spinning;
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
.login-form-forgot {
    float: right;
}
</style>
