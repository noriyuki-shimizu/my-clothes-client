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
import language, { setLanguage, getLanguage } from '@/plugins/i18n/language';
import { LanguageSelectSize } from './type';

@Component
export default class LanguageSelect extends Vue {
    $store!: Vuex.ExStore;

    language = language;

    selectedLanguage = getLanguage();

    @Prop({ type: String as () => LanguageSelectSize })
    size?: LanguageSelectSize;

    handleChange(languageName: string) {
        setLanguage(languageName);
        this.$i18n.locale = languageName;
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
