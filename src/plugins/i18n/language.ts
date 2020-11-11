import storageKey from '@/util/storageKey';

export const getLanguage = () => {
    return localStorage.getItem(storageKey.SELECTED_LANGUAGE_KEY) || 'en';
};

export const setLanguage = (lang: string) => {
    localStorage.setItem(storageKey.SELECTED_LANGUAGE_KEY, lang);
};

export default {
    en: {
        displayName: 'English',
        value: 'en'
    },
    ja: {
        displayName: '日本語',
        value: 'ja'
    }
} as const;
