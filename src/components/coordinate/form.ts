import { Form } from 'ant-design-vue';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 3 },
    wrapperCol: { span: 17 }
};

export const seasons: Readonly<Season[]> = [
    'spring',
    'summer',
    'autumn',
    'winter'
];

export default {};
