import { IModuleRootMutations } from '@/store/type';
import { FormFields } from '@/components/brand/type';

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
    brandsStateChange: Brand[];
    addBrand: Brand;
    updateBrand: Omit<FormFields, 'image'> & Pick<Brand, 'id' | 'imageLink'>;
    deleteBrand: Brand['id'];
    restorationBrand: Brand['id'];
}
export interface IRootMutations {
    'brand/allStateReset': IMutations['allStateReset'];
    'brand/brandsStateChange': IMutations['brandsStateChange'];
    'brand/addBrand': IMutations['addBrand'];
    'brand/updateBrand': IMutations['updateBrand'];
    'brand/deleteBrand': IMutations['deleteBrand'];
    'brand/restorationBrand': IMutations['restorationBrand'];
}

export interface IActions {
    fetchBrands: void;
    onAddBrand: FormFields;
    onUpdateBrand: FormFields & Pick<Brand, 'id'>;
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
