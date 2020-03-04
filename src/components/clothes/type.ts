import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { Moment } from 'moment';
import { Clothes } from '@/store/clothes/type';

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
    clothes: {
        brandId: number;
        shopId: number;
        genreIds: number[];
        price: number;
        buyDate: string;
        comment: string;
        satisfaction: number;
    };
    imageFile: File | null;
};

export type Record = Pick<
    Clothes,
    'imageLink' | 'genres' | 'buyDate' | 'comment' | 'satisfaction'
> & {
    key?: number;
    brandName: string;
    shopName: string;
    price: string;
    deleted: string;
};
