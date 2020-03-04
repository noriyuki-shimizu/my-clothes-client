import { Form } from 'ant-design-vue/types/form/form';

import { dateFormat } from '@/util/date';
import { FormFields, ConvertedFormFields } from '@/components/clothes/type';

export const formItemLayout: Readonly<ExPartial<Form>> = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
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
        clothes: {
            brandId,
            shopId,
            genreIds,
            price,
            buyDate: formatBuyDate,
            comment,
            satisfaction
        },
        imageFile
    };
};
