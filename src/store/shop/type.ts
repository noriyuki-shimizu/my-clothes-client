import { IModuleRootMutations } from '@/store/type';

export interface Shop {
    id: number;
    name: string;
    link: string | null;
    stationName: string;
    imageId: number | null;
    imageLink: string | null;
    address: string;
    businessHours: string;
    tel: string;
    isDeleted: boolean;
}

export interface State {
    shops: Shop[];
}

export interface IGetters {
    shops: Shop[];
}
export interface IRootGetters {
    'shop/shops': IGetters['shops'];
}

export interface IMutations extends IModuleRootMutations {
    onShopsStateChange: Shop[];
    onAddShop: Shop;
    onUpdateTargetShop: Shop;
}
export interface IRootMutations {
    'shop/allStateReset': IMutations['allStateReset'];
    'shop/onShopsStateChange': IMutations['onShopsStateChange'];
    'shop/onAddShop': IMutations['onAddShop'];
    'shop/onUpdateTargetShop': IMutations['onUpdateTargetShop'];
}

type AddValue = {
    shop: Pick<
        Shop,
        'name' | 'link' | 'stationName' | 'address' | 'businessHours' | 'tel'
    >;
    imageFile: File | null;
};

type UpdateValue = {
    id: Shop['id'];
    shop: Pick<
        Shop,
        | 'name'
        | 'link'
        | 'stationName'
        | 'imageId'
        | 'imageLink'
        | 'address'
        | 'businessHours'
        | 'tel'
    >;
    imageFile: File | null;
};

export interface IActions {
    fetchShops: void;
    onAddShop: AddValue;
    onUpdateShop: UpdateValue;
    onDeleteShop: Shop['id'];
    onRestorationShop: Shop['id'];
}
export interface IRootActions {
    'shop/fetchShops': IActions['fetchShops'];
    'shop/onAddShop': IActions['onAddShop'];
    'shop/onUpdateShop': IActions['onUpdateShop'];
    'shop/onDeleteShop': IActions['onDeleteShop'];
    'shop/onRestorationShop': IActions['onRestorationShop'];
}
