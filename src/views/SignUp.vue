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
                <SignUpForm
                    v-on:set-message="setMessage"
                    v-on:set-loading="setLoading"
                />
                Do you have an account?
                <router-link to="/sign-in">
                    Then sign in now!
                </router-link>
            </a-card>
        </a-spin>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';

import SignUpForm from '@/components/auth/SignUpForm.vue';
import { resetMessage } from '@/util/reset';

@Component({
    components: {
        SignUpForm
    }
})
export default class SignUn extends Vue {
    spinning = false;

    registerMessage: AppMessage = resetMessage();

    @Emit('set-loading')
    setLoading(spinning: boolean) {
        this.spinning = spinning;
    }

    @Emit('set-message')
    setMessage(message: AppMessage) {
        this.registerMessage = message;
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
.registered-message {
    margin-bottom: 5%;
}
</style>
