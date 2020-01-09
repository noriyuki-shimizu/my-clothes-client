export interface Brand {
    id?: number;
    name: string;
    link?: string;
    imageId?: number;
    imageLink?: string;
    country?: string;
    isDeleted: boolean;
}

export interface State {
    brands: Brand[];
}

export interface IGetters {
    brands: Brand[];
}
export interface IRootGetters {
    'brand/brands': IGetters['brands'];
}

export interface IMutations {
    onBrandsStateChange: Brand[];
    onAddBrand: Brand;
    onUpdateTargetBrand: Brand;
}
export interface IRootMutations {
    'brand/onBrandsStateChange': IMutations['onBrandsStateChange'];
    'brand/onAddBrand': IMutations['onAddBrand'];
    'brand/onUpdateTargetBrand': IMutations['onUpdateTargetBrand'];
}

export interface IActions {
    fetchBrands: void;
    onAddBrand: {
        brand: Pick<Brand, 'name' | 'link' | 'country'>;
        imageFile: File | null;
    };
    onUpdateBrand: {
        id: Brand['id'];
        brand: Pick<
            Brand,
            'name' | 'link' | 'country' | 'imageId' | 'imageLink'
        >;
        imageFile: File | null;
    };
    onDeleteBrand: {
        id: Brand['id'];
    };
    onRestorationBrand: {
        id: Brand['id'];
    };
}
export interface IRootActions {
    'brand/fetchBrands': IActions['fetchBrands'];
    'brand/onAddBrand': IActions['onAddBrand'];
    'brand/onUpdateBrand': IActions['onUpdateBrand'];
    'brand/onDeleteBrand': IActions['onDeleteBrand'];
    'brand/onRestorationBrand': IActions['onRestorationBrand'];
}
