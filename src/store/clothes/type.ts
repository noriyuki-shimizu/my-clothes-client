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
export interface AssistGenre {
    id: number;
    name: string;
    color: string;
}

export interface AssistBrand {
    id: number;
    name: string;
}

export interface AssistShop {
    id: number;
    name: string;
}

export interface State {
    clothes: Clothes[];
    assistGenres: AssistGenre[];
    assistBrands: AssistBrand[];
    assistShops: AssistShop[];
}

export interface IGetters {
    clothes: Clothes[];
    assistGenres: AssistGenre[];
    assistBrands: AssistBrand[];
    assistShops: AssistShop[];
}
export interface IRootGetters {
    'clothes/clothes': IGetters['clothes'];
    'clothes/assistGenres': IGetters['assistGenres'];
    'clothes/assistBrands': IGetters['assistBrands'];
    'clothes/assistShops': IGetters['assistShops'];
}

export interface IMutations {
    onClothesStateChange: Clothes[];
    onAddClothes: Clothes;
    onUpdateTargetClothes: Clothes;
    onAssistGenreStateChange: AssistGenre[];
    onAssistBrandStateChange: AssistBrand[];
    onAssistShopStateChange: AssistShop[];
}
export interface IRootMutations {
    'clothes/onClothesStateChange': IMutations['onClothesStateChange'];
    'clothes/onAddClothes': IMutations['onAddClothes'];
    'clothes/onUpdateTargetClothes': IMutations['onUpdateTargetClothes'];
    'clothes/onAssistGenreStateChange': IMutations['onAssistGenreStateChange'];
    'clothes/onAssistBrandStateChange': IMutations['onAssistBrandStateChange'];
    'clothes/onAssistShopStateChange': IMutations['onAssistShopStateChange'];
}

export interface IActions {
    fetchClothes: void;
    fetchAssistGenres: void;
    fetchAssistBrands: void;
    fetchAssistShops: void;
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
    'clothes/fetchAssistGenres': IActions['fetchAssistGenres'];
    'clothes/fetchAssistBrands': IActions['fetchAssistBrands'];
    'clothes/fetchAssistShops': IActions['fetchAssistShops'];
    'clothes/onAddClothes': IActions['onAddClothes'];
    'clothes/onUpdateClothes': IActions['onUpdateClothes'];
    'clothes/onDeleteClothes': IActions['onDeleteClothes'];
    'clothes/onRestorationClothes': IActions['onRestorationClothes'];
}
