import { Genre } from '@/store/genre/type';

export type FormFields = {
    name: string;
    color: string;
};

export type Record = Pick<Genre, 'name' | 'color'> & {
    key?: number;
};
