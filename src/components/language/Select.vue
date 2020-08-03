<template>
    <a-select
        :size="specifiedSize"
        class="select-language-field"
        :default-value="selectedLanguage"
        @change="handleChange"
    >
        <a-select-option v-for="lang in language" :key="lang.value">
            {{ lang.displayName }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import * as Vuex from 'vuex';
import { selectedLanguageKey } from '@/plugins/i18n';
import language from '@/plugins/i18n/language';
import { LanguageSelectSize } from './type';

@Component
export default class LanguageSelect extends Vue {
    $store!: Vuex.ExStore;

    language = language;

    @Prop({ type: String as () => LanguageSelectSize })
    size?: LanguageSelectSize;

    handleChange(languageName: string) {
        localStorage.setItem(selectedLanguageKey, languageName);
        this.$i18n.locale = languageName;
    }

    get selectedLanguage() {
        const { value } = this.language.en;
        return localStorage.getItem(selectedLanguageKey) || value;
    }

    get specifiedSize(): LanguageSelectSize {
        return this.size || 'default';
    }
}
</script>

<style scoped>
.select-language-field {
    width: 110px;
}
</style>
