import { Form } from 'ant-design-vue';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 8, offset: 0 }
    },
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 0 }
    }
};
