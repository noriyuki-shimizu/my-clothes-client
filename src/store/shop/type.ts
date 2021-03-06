import { FormFields } from '@/components/shop/type';

export interface Shop {
    id: number;
    name: string;
    link: string | null;
    stationName: string;
    imageId: number | null;
    imageLink: string | null;
    address: string;
    businessHours: string;
    isBusinessStatus: boolean;
    tel: string;
    isDeleted: boolean;
}

export interface State {
    shop: Shop;
    shops: Shop[];
}

export interface IGetters {
    shop: Shop;
    shops: Shop[];
}
export interface IRootGetters {
    'shop/shop': IGetters['shop'];
    'shop/shops': IGetters['shops'];
}

export interface IMutations {
    resetShop: void;
    shopStateChange: Shop;
    shopsStateChange: Shop[];
    addShop: Shop;
    deleteShop: Shop['id'];
    restorationShop: Shop['id'];
}
export interface IRootMutations {
    'shop/resetShop': IMutations['resetShop'];
    'shop/shopStateChange': IMutations['shopStateChange'];
    'shop/shopsStateChange': IMutations['shopsStateChange'];
    'shop/addShop': IMutations['addShop'];
    'shop/deleteShop': IMutations['deleteShop'];
    'shop/restorationShop': IMutations['restorationShop'];
}

export interface IActions {
    fetchShop: Shop['id'];
    fetchShops: void;
    onAddShop: FormFields;
    onUpdateShop: FormFields & Pick<Shop, 'id'>;
    onDeleteShop: Shop['id'];
    onRestorationShop: Shop['id'];
}
export interface IRootActions {
    'shop/fetchShop': IActions['fetchShop'];
    'shop/fetchShops': IActions['fetchShops'];
    'shop/onAddShop': IActions['onAddShop'];
    'shop/onUpdateShop': IActions['onUpdateShop'];
    'shop/onDeleteShop': IActions['onDeleteShop'];
    'shop/onRestorationShop': IActions['onRestorationShop'];
}
