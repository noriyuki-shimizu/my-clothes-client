import { Brand } from '../brand/type';
import { Shop } from '../shop/type';
import { Genre } from '../genre/type';

export interface Clothes {
    id?: number;
    imageId?: number;
    imageLink?: string;
    brand: Pick<Brand, 'id' | 'name'>;
    shop: Pick<Shop, 'id' | 'name'>;
    genres: Pick<Genre, 'id' | 'name' | 'color'>[];
    price: number;
    buyDate: string;
    comment?: string;
    satisfaction?: number;
    isDeleted: boolean;
}

export interface State {
    clothes: Clothes[];
}

export interface IGetters {
    clothes: Clothes[];
}
export interface IRootGetters {
    'clothes/clothes': IGetters['clothes'];
}

export interface IMutations {
    onClothesStateChange: Clothes[];
    onAddClothes: Clothes;
    onUpdateTargetClothes: Clothes;
}
export interface IRootMutations {
    'clothes/onClothesStateChange': IMutations['onClothesStateChange'];
    'clothes/onAddClothes': IMutations['onAddClothes'];
    'clothes/onUpdateTargetClothes': IMutations['onUpdateTargetClothes'];
}

export interface IActions {
    fetchClothes: void;
    onAddClothes: Pick<
        Clothes,
        'price' | 'buyDate' | 'comment' | 'satisfaction'
    > & {
        brandId: number;
        shopId: number;
        genreIds: number[];
        imageFile: File | null;
    };
    onUpdateClothes: Pick<
        Clothes,
        | 'id'
        | 'imageId'
        | 'imageLink'
        | 'price'
        | 'buyDate'
        | 'comment'
        | 'satisfaction'
    > & {
        brandId: number;
        shopId: number;
        genreIds: number[];
        imageFile: File | null;
    };
    onDeleteClothes: {
        id: Clothes['id'];
    };
    onRestorationClothes: {
        id: Clothes['id'];
    };
}
export interface IRootActions {
    'clothes/fetchClothes': IActions['fetchClothes'];
    'clothes/onAddClothes': IActions['onAddClothes'];
    'clothes/onUpdateClothes': IActions['onUpdateClothes'];
    'clothes/onDeleteClothes': IActions['onDeleteClothes'];
    'clothes/onRestorationClothes': IActions['onRestorationClothes'];
}
