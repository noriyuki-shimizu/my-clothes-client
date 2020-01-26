import { Form } from 'ant-design-vue/types/form/form';
import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { Moment } from 'moment';

import { dateFormat } from '@/util/date';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
};

export type FormFields = {
    image: DoneUploadFileInfo;
    brandId: number;
    shopId: number;
    genreIds: number[];
    price: number;
    buyDate: Moment;
    comment: string;
    satisfaction: number;
};

export type ConvertedFormFields = {
    brandId: number;
    shopId: number;
    genreIds: number[];
    price: number;
    buyDate: string;
    comment: string;
    satisfaction: number;
    imageFile: File | null;
};

export const convertFormFields = (values: FormFields): ConvertedFormFields => {
    const {
        image,
        brandId,
        shopId,
        genreIds,
        price,
        buyDate,
        comment,
        satisfaction
    } = values;

    const imageFile = image && image.file ? image.file.originFileObj : null;

    const formatBuyDate = buyDate.format(dateFormat);

    return {
        imageFile,
        brandId,
        shopId,
        genreIds,
        price,
        buyDate: formatBuyDate,
        comment,
        satisfaction
    };
};
