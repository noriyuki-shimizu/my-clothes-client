import { Form } from 'ant-design-vue';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type FormFields = {
    image: DoneUploadFileInfo;
    season: string;
    clothingIds: number[];
};

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 3 },
    wrapperCol: { span: 17 }
};
