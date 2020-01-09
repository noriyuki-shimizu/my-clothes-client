import { FieldDecorator, Form } from 'ant-design-vue/types/form/form';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';

export const decorator: Readonly<FieldDecorator> = {
    name: [
        'name',
        {
            rules: [
                {
                    max: 60,
                    message: 'Name cannot be longer than 60 characters!'
                },
                {
                    required: true,
                    message: 'Please input your name!'
                }
            ]
        }
    ],
    image: ['image', {}],
    link: [
        'link',
        {
            rules: [
                {
                    max: 100,
                    message: 'Link cannot be longer than 100 characters!'
                }
            ]
        }
    ],
    country: [
        'country',
        {
            rules: [
                {
                    max: 15,
                    message: 'Country cannot be longer than 15 characters!'
                },
                {
                    required: true,
                    message: 'Please input your country!'
                }
            ]
        }
    ]
};

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
