import { IModuleRootMutations } from '@/store/type';
import { FormFields } from '@/components/clothes/type';
import { Brand } from '@/store/brand/type';
import { Shop } from '@/store/shop/type';
import { Genre } from '@/store/genre/type';

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
    item: Clothes;
    clothes: Clothes[];
    assistGenres: AssistGenre[];
    assistBrands: AssistBrand[];
    assistShops: AssistShop[];
    totalPrice: number;
}

export interface IGetters {
    item: Clothes;
    clothes: Clothes[];
    assistGenres: AssistGenre[];
    assistBrands: AssistBrand[];
    assistShops: AssistShop[];
    totalPrice: number;
}
export interface IRootGetters {
    'clothes/item': IGetters['item'];
    'clothes/clothes': IGetters['clothes'];
    'clothes/assistGenres': IGetters['assistGenres'];
    'clothes/assistBrands': IGetters['assistBrands'];
    'clothes/assistShops': IGetters['assistShops'];
    'clothes/totalPrice': IGetters['totalPrice'];
}

export interface IMutations extends IModuleRootMutations {
    resetItem: void;
    itemStateChange: Clothes;
    clothesStateChange: Clothes[];
    addClothes: Clothes;
    deleteClothes: Clothes['id'];
    restorationClothes: Clothes['id'];
    assistGenreStateChange: AssistGenre[];
    assistBrandStateChange: AssistBrand[];
    assistShopStateChange: AssistShop[];
    totalPriceStateChange: number;
}
export interface IRootMutations {
    'clothes/allStateReset': IMutations['allStateReset'];
    'clothes/resetItem': IMutations['resetItem'];
    'clothes/itemStateChange': IMutations['itemStateChange'];
    'clothes/clothesStateChange': IMutations['clothesStateChange'];
    'clothes/addClothes': IMutations['addClothes'];
    'clothes/deleteClothes': IMutations['deleteClothes'];
    'clothes/restorationClothes': IMutations['restorationClothes'];
    'clothes/assistGenreStateChange': IMutations['assistGenreStateChange'];
    'clothes/assistBrandStateChange': IMutations['assistBrandStateChange'];
    'clothes/assistShopStateChange': IMutations['assistShopStateChange'];
    'clothes/totalPriceStateChange': IMutations['totalPriceStateChange'];
}

export interface IActions {
    fetchOne: Clothes['id'];
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
    'clothes/fetchOne': IActions['fetchOne'];
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
