import { IModuleRootMutations } from '@/store/type';
import { FormFields } from '@/components/clothes/type';
import { Brand } from '../brand/type';
import { Shop } from '../shop/type';
import { Genre } from '../genre/type';

export interface AssistGenre extends Genre {}

export interface AssistBrand extends Pick<Brand, 'id' | 'name'> {}

export interface AssistShop extends Pick<Shop, 'id' | 'name'> {}

export interface Clothes {
    id: number;
    imageId: number | null;
    imageLink: string | null;
    brand: AssistBrand;
    shop: AssistShop;
    genres: AssistGenre[];
    price: number;
    buyDate: string;
    comment: string | null;
    satisfaction: number | null;
    isDeleted: boolean;
}

export interface ClothesItem {
    id: number;
    imageLink: string;
    brandName: string;
    shopName: string;
    genres: Pick<Genre, 'name' | 'color'>[];
    price: number;
    buyDate: string;
    comment: string;
    satisfaction: number;
}

export interface State {
    clothes: Clothes[];
    assistGenres: AssistGenre[];
    assistBrands: AssistBrand[];
    assistShops: AssistShop[];
    totalPrice: number;
}

export interface IGetters {
    clothes: Clothes[];
    assistGenres: AssistGenre[];
    assistBrands: AssistBrand[];
    assistShops: AssistShop[];
    totalPrice: number;
}
export interface IRootGetters {
    'clothes/clothes': IGetters['clothes'];
    'clothes/assistGenres': IGetters['assistGenres'];
    'clothes/assistBrands': IGetters['assistBrands'];
    'clothes/assistShops': IGetters['assistShops'];
    'clothes/totalPrice': IGetters['totalPrice'];
}

export interface IMutations extends IModuleRootMutations {
    clothesStateChange: Clothes[];
    addClothes: Clothes;
    updateClothes: Omit<FormFields, 'image' | 'buyDate'> &
        Pick<Clothes, 'id' | 'buyDate' | 'imageLink'>;
    deleteClothes: Clothes['id'];
    restorationClothes: Clothes['id'];
    assistGenreStateChange: AssistGenre[];
    assistBrandStateChange: AssistBrand[];
    assistShopStateChange: AssistShop[];
    totalPriceStateChange: number;
}
export interface IRootMutations {
    'clothes/allStateReset': IMutations['allStateReset'];
    'clothes/clothesStateChange': IMutations['clothesStateChange'];
    'clothes/addClothes': IMutations['addClothes'];
    'clothes/updateClothes': IMutations['updateClothes'];
    'clothes/deleteClothes': IMutations['deleteClothes'];
    'clothes/restorationClothes': IMutations['restorationClothes'];
    'clothes/assistGenreStateChange': IMutations['assistGenreStateChange'];
    'clothes/assistBrandStateChange': IMutations['assistBrandStateChange'];
    'clothes/assistShopStateChange': IMutations['assistShopStateChange'];
    'clothes/totalPriceStateChange': IMutations['totalPriceStateChange'];
}

export interface IActions {
    fetchClothes: void;
    fetchAssistGenres: void;
    fetchAssistBrands: void;
    fetchAssistShops: void;
    fetchTotalPrice: void;
    onAddClothes: FormFields;
    onUpdateClothes: FormFields & Pick<Clothes, 'id'>;
    onDeleteClothes: Clothes['id'];
    onRestorationClothes: Clothes['id'];
}
export interface IRootActions {
    'clothes/fetchClothes': IActions['fetchClothes'];
    'clothes/fetchAssistGenres': IActions['fetchAssistGenres'];
    'clothes/fetchAssistBrands': IActions['fetchAssistBrands'];
    'clothes/fetchAssistShops': IActions['fetchAssistShops'];
    'clothes/fetchTotalPrice': IActions['fetchTotalPrice'];
    'clothes/onAddClothes': IActions['onAddClothes'];
    'clothes/onUpdateClothes': IActions['onUpdateClothes'];
    'clothes/onDeleteClothes': IActions['onDeleteClothes'];
    'clothes/onRestorationClothes': IActions['onRestorationClothes'];
}
