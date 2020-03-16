import { IModuleRootMutations } from '@/store/type';
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
    shopsStateChange: Shop[];
    addShop: Shop;
    updateShop: Omit<
        FormFields,
        'image' | 'startBusinessHours' | 'endBusinessHours'
    > &
        Pick<Shop, 'id' | 'imageLink' | 'businessHours'>;
    deleteShop: Shop['id'];
    restorationShop: Shop['id'];
}
export interface IRootMutations {
    'shop/allStateReset': IMutations['allStateReset'];
    'shop/shopsStateChange': IMutations['shopsStateChange'];
    'shop/addShop': IMutations['addShop'];
    'shop/updateShop': IMutations['updateShop'];
    'shop/deleteShop': IMutations['deleteShop'];
    'shop/restorationShop': IMutations['restorationShop'];
}

export interface IActions {
    fetchShops: void;
    onAddShop: FormFields;
    onUpdateShop: FormFields & Pick<Shop, 'id'>;
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
