import { Form } from 'ant-design-vue/types/form/form';

// FIXME: サーバから以下のデータを取得するよう修正すること（一旦をそのままにしていた、、、）
export const colors: string[] = [
    'pink',
    'red',
    'orange',
    'green',
    'cyan',
    'blue',
    'purple',
    'yellow',
    'goldenrod',
    'gray',
    'black',
    'navy',
    'olive',
    'lightskyblue',
    'slategray',
    'darkorange',
    'darkred',
    'indigo',
    'darkblue',
    'yellowgreen'
];

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export type FormFields = {
    name: string;
    color: string;
};
