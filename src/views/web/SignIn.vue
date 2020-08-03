<template>
    <div>
        <div id="sign_in">
            <div id="sign_in_title_field">
                <h1>{{ $t('dictionary.authentication.signin') }}</h1>
                <language-select id="outer_language_block" size="large" />
            </div>

            <a-divider class="c-pipe" />

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
import LanguageSelect from '@/components/language/Select.vue';
import * as Vuex from 'vuex';
import { selectedLanguageKey } from '@/plugins/i18n';

@Component({
    components: {
        ExternalApi,
        AppFooter,
        LanguageSelect
    }
})
export default class SignIn extends Vue {}
</script>

<style scoped>
h1 {
    font-size: 2rem;
}

#sign_in {
    padding: 150px 20%;
    width: 100vw;
}

#sign_in_footer {
    width: 100%;
    padding: 15px 50px;
    background: #f0f2f5;
    position: absolute;
    bottom: 0;
}

#sign_in_title_field {
    display: flex;
    justify-content: space-between;
    padding: 0 15%;
}

#outer_language_block {
    padding-top: 5px;
}
</style>
