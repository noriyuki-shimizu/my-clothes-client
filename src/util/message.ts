import { AppMessage } from 'ant-design-vue/types/message';
import { FirebaseAuthError } from 'firebase';
import Vue from 'vue';

export const resetMessage = (): AppMessage => ({
    isShow: false,
    text: '',
    description: '',
    type: null
});

export const toErrorMessage = ($t: Vue['$t'], err: any): AppMessage => {
    const { data } = err.response;
    return {
        isShow: true,
        text: $t('status.error').toString(),
        description: $t(data).toString(),
        type: 'error'
    };
};

export const toFirebaseErrorMessage = (
    $t: Vue['$t'],
    err: FirebaseAuthError
): AppMessage => {
    const code = err.code.split('auth/').pop();
    const description = code
        ? $t(`message.error.auth.${code}`).toString()
        : err.message;

    return {
        isShow: true,
        text: $t('status.error').toString(),
        description,
        type: 'error'
    };
};
