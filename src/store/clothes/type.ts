import { Brand } from '../brand/type';
import { Shop } from '../shop/type';
import { Genre } from '../genre/type';
import { IModuleRootMutations } from '@/store/type';

export interface Clothes {
    id: number;
    imageId: number | null;
    imageLink: string | null;
    brand: Pick<Brand, 'id' | 'name'>;
    shop: Pick<Shop, 'id' | 'name'>;
    genres: Pick<Genre, 'id' | 'name' | 'color'>[];
    price: number;
    buyDate: string;
    comment: string | null;
    satisfaction: number | null;
    isDeleted: boolean;
}
export interface AssistGenre extends Genre {}

export interface AssistBrand extends Pick<Brand, 'id' | 'name'> {}

export interface AssistShop extends Pick<Shop, 'id' | 'name'> {}

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

export interface IMutations extends IModuleRootMutations {
    onClothesStateChange: Clothes[];
    onAddClothes: Clothes;
    onUpdateTargetClothes: Clothes;
    onAssistGenreStateChange: AssistGenre[];
    onAssistBrandStateChange: AssistBrand[];
    onAssistShopStateChange: AssistShop[];
}
export interface IRootMutations {
    'clothes/allStateReset': IMutations['allStateReset'];
    'clothes/onClothesStateChange': IMutations['onClothesStateChange'];
    'clothes/onAddClothes': IMutations['onAddClothes'];
    'clothes/onUpdateTargetClothes': IMutations['onUpdateTargetClothes'];
    'clothes/onAssistGenreStateChange': IMutations['onAssistGenreStateChange'];
    'clothes/onAssistBrandStateChange': IMutations['onAssistBrandStateChange'];
    'clothes/onAssistShopStateChange': IMutations['onAssistShopStateChange'];
}

type AddValue = {
    clothes: Pick<Clothes, 'price' | 'buyDate' | 'comment' | 'satisfaction'> & {
        brandId: Brand['id'];
        shopId: Shop['id'];
        genreIds: Genre['id'][];
    };
    imageFile: File | null;
};

type UpdateValue = {
    id: Clothes['id'];
    clothes: Pick<
        Clothes,
        | 'imageId'
        | 'imageLink'
        | 'price'
        | 'buyDate'
        | 'comment'
        | 'satisfaction'
    > & {
        brandId: Brand['id'];
        shopId: Shop['id'];
        genreIds: Genre['id'][];
    };
    imageFile: File | null;
};

export interface IActions {
    fetchClothes: void;
    fetchAssistGenres: void;
    fetchAssistBrands: void;
    fetchAssistShops: void;
    onAddClothes: AddValue;
    onUpdateClothes: UpdateValue;
    onDeleteClothes: Clothes['id'];
    onRestorationClothes: Clothes['id'];
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
