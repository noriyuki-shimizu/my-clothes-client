import { Form } from 'ant-design-vue/types/form/form';

import { timeFormat } from '@/util/date';
import { FormFields, ConvertedFormFields } from './type';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
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
        shop: { name, link, stationName, address, tel, businessHours },
        imageFile
    };
};
