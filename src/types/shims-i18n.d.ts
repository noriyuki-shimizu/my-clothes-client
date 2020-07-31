import en from '@/assets/i18n/en.json';
import ja from '@/assets/i18n/ja.json';

declare module 'i18n' {
    type En = typeof en;
    type Ja = typeof ja;
}
