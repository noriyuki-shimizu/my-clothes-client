import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { Moment } from 'moment';
import { Shop } from '@/store/shop/type';

export type Record = Pick<
    Shop,
    | 'name'
    | 'link'
    | 'imageLink'
    | 'stationName'
    | 'address'
    | 'isBusinessStatus'
    | 'tel'
> & {
    key?: number;
    deleted: string;
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
