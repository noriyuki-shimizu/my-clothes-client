import { Genre } from '@/store/genre/type';

export type FormFields = {
    name: string;
    color: string;
    description: string;
};

export type Record = Pick<Genre, 'name' | 'color' | 'description'> & {
    key?: number;
};
