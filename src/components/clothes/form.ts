import { Form } from 'ant-design-vue/types/form/form';

// export const formItemLayout: Readonly<ExPartial<Form>> = {
//     labelCol: { span: 6 },
//     wrapperCol: { span: 14 }
// };

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: {
        xs: 0,
        sm: {
            span: 6,
            offset: 0
        },
        md: {
            span: 6,
            offset: 0
        },
        lg: {
            span: 5,
            offset: 0
        },
        xl: {
            span: 4,
            offset: 0
        },
        xxl: {
            span: 3,
            offset: 0
        }
    },
    wrapperCol: {
        xs: 0,
        sm: {
            span: 16,
            offset: 0
        },
        md: {
            span: 16,
            offset: 0
        },
        lg: {
            span: 17,
            offset: 0
        },
        xl: {
            span: 17,
            offset: 0
        },
        xxl: {
            span: 17,
            offset: 0
        }
    }
};

export default {};
