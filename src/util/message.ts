import { AppMessage } from 'ant-design-vue/types/message';
import { FirebaseExternalApiAuthError } from 'firebase';

export const resetMessage = (): AppMessage => ({
    isShow: false,
    text: '',
    description: '',
    type: null
});

export const toErrorMessage = (err: any): AppMessage => ({
    isShow: true,
    text: `Error (${err.code})`,
    description: `${err.message}`,
    type: 'error'
});

export const toFirebaseErrorMessage = (
    err: FirebaseExternalApiAuthError
): AppMessage => {
    return {
        isShow: true,
        text: `Error (${err.code})`,
        description: `${err.message} ProviderId is "${err.credential.providerId}", Email is "${err.email}"`,
        type: 'error'
    };
};
