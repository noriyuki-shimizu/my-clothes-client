<template>
    <div>
        <div id="sign_in">
            <h1>Sign in</h1>
            <a-divider />
            <external-api />
        </div>
        <div id="sign_in_footer">
            <app-footer />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import ExternalApi from '@/components/auth/ExternalApi.vue';
import AppFooter from '@/components/layout/Footer.vue';

@Component({
    components: {
        ExternalApi,
        AppFooter
    }
})
export default class SignIn extends Vue {}
</script>

<style scoped>
h1 {
    margin-left: 10%;
    font-size: 2em;
}
#sign_in {
    padding: 10% 15%;
    width: 100vw;
}
#sign_in_footer {
    width: 100%;
    padding: 15px 50px;
    background: #f0f2f5;
    position: absolute;
    bottom: 0;
}
</style>
