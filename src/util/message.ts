import { AppMessage } from 'ant-design-vue/types/message';

export const resetMessage = (): AppMessage => ({
    isShow: false,
    text: '',
    description: '',
    type: null
});
