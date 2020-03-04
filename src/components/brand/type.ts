import { DoneUploadFileInfo } from 'ant-design-vue/types/upload';
import { Brand } from '@/store/brand/type';

export type FormFields = {
    name: string;
    image: DoneUploadFileInfo;
    link: string;
    country: string;
};

export type Record = Pick<Brand, 'name' | 'link' | 'imageLink' | 'country'> & {
    key?: number;
    deleted: string;
};
