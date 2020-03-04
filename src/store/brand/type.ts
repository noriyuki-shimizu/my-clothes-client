import { IModuleRootMutations } from '@/store/type';

export interface Brand {
    id: number;
    name: string;
    link: string | null;
    imageId: number | null;
    imageLink: string | null;
    country: string;
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

export interface IMutations extends IModuleRootMutations {
    onBrandsStateChange: Brand[];
    onAddBrand: Brand;
    onUpdateTargetBrand: Brand;
}
export interface IRootMutations {
    'brand/allStateReset': IMutations['allStateReset'];
    'brand/onBrandsStateChange': IMutations['onBrandsStateChange'];
    'brand/onAddBrand': IMutations['onAddBrand'];
    'brand/onUpdateTargetBrand': IMutations['onUpdateTargetBrand'];
}

type AddValue = {
    brand: Pick<Brand, 'name' | 'link' | 'country'>;
    imageFile: File | null;
};

type UpdateValue = {
    id: Brand['id'];
    brand: Pick<Brand, 'name' | 'link' | 'country' | 'imageId' | 'imageLink'>;
    imageFile: File | null;
};

export interface IActions {
    fetchBrands: void;
    onAddBrand: AddValue;
    onUpdateBrand: UpdateValue;
    onDeleteBrand: Brand['id'];
    onRestorationBrand: Brand['id'];
}
export interface IRootActions {
    'brand/fetchBrands': IActions['fetchBrands'];
    'brand/onAddBrand': IActions['onAddBrand'];
    'brand/onUpdateBrand': IActions['onUpdateBrand'];
    'brand/onDeleteBrand': IActions['onDeleteBrand'];
    'brand/onRestorationBrand': IActions['onRestorationBrand'];
}
