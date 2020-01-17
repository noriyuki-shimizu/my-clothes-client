export interface Shop {
    id?: number;
    name: string;
    link?: string;
    stationName: string;
    imageId?: number;
    imageLink?: string;
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

export interface IMutations {
    onShopsStateChange: Shop[];
    onAddShop: Shop;
    onUpdateTargetShop: Shop;
}
export interface IRootMutations {
    'shop/onShopsStateChange': IMutations['onShopsStateChange'];
    'shop/onAddShop': IMutations['onAddShop'];
    'shop/onUpdateTargetShop': IMutations['onUpdateTargetShop'];
}

export interface IActions {
    fetchShops: void;
    onAddShop: Pick<
        Shop,
        'name' | 'link' | 'stationName' | 'address' | 'businessHours' | 'tel'
    > & { imageFile: File | null };
    onUpdateShop: Pick<
        Shop,
        | 'id'
        | 'name'
        | 'link'
        | 'stationName'
        | 'imageId'
        | 'imageLink'
        | 'address'
        | 'businessHours'
        | 'tel'
    > & { imageFile: File | null };
    onDeleteShop: {
        id: Shop['id'];
    };
    onRestorationShop: {
        id: Shop['id'];
    };
}
export interface IRootActions {
    'shop/fetchShops': IActions['fetchShops'];
    'shop/onAddShop': IActions['onAddShop'];
    'shop/onUpdateShop': IActions['onUpdateShop'];
    'shop/onDeleteShop': IActions['onDeleteShop'];
    'shop/onRestorationShop': IActions['onRestorationShop'];
}
