import { Form } from 'ant-design-vue/types/form/form';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { Moment } from 'moment';

import { timeFormat } from '@/util/date';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export type FormFields = {
    name: string;
    image: DoneUploadFileInfo;
    link: string;
    stationName: string;
    address: string;
    startBusinessHours: Moment;
    endBusinessHours: Moment;
    tel: string;
};

export type ConvertedFormFields = {
    name: string;
    link: string;
    stationName: string;
    address: string;
    businessHours: string;
    tel: string;
    imageFile: File | null;
};

export const convertFormFields = (values: FormFields): ConvertedFormFields => {
    const {
        name,
        image,
        link,
        stationName,
        address,
        startBusinessHours,
        endBusinessHours,
        tel
    } = values;

    const imageFile = image && image.file ? image.file.originFileObj : null;

    const businessHours = `${startBusinessHours.format(
        timeFormat
    )}~${endBusinessHours.format(timeFormat)}`;

    return {
        name,
        link,
        stationName,
        address,
        tel,
        imageFile,
        businessHours
    };
};
