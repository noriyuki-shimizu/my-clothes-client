import { Form } from 'ant-design-vue/types/form/form';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export type FormFields = {
    name: string;
    color: string;
};
