const selectedLanguageKey = 'selectedLanguage';

export const getLanguage = () => {
    return localStorage.getItem(selectedLanguageKey) || 'en';
};

export const setLanguage = (lang: string) => {
    localStorage.setItem(selectedLanguageKey, lang);
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
