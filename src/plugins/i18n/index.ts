import en from '@/assets/i18n/en.json';
import ja from '@/assets/i18n/ja.json';
import Vue, { VueConstructor } from 'vue';
import VueI18n from 'vue-i18n';
import { getLanguage } from './language';

export default (Vue?: VueConstructor<Vue>) => {
    if (Vue) {
        Vue.use(VueI18n);
    }

    return new VueI18n({
        locale: getLanguage(),
        messages: {
            en,
            ja
        }
    });
};
