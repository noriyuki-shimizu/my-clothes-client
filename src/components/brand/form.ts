import { Form } from 'ant-design-vue/types/form/form';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export type FormFields = {
    name: string;
    image: DoneUploadFileInfo;
    link: string;
    country: string;
};
