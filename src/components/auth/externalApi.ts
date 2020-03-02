import { FirebaseExternalApiAuthError } from 'firebase';
import { AppMessage } from 'ant-design-vue/types/message';

export const mappingMessage = (
    err: FirebaseExternalApiAuthError
): AppMessage => {
    return {
        isShow: true,
        text: `Error (${err.code})`,
        description: `${err.message} ProviderId is "${err.credential.providerId}", Email is "${err.email}"`,
        type: 'error'
    };
};
