interface Brand {
    id?: number;
    name: string;
    link?: string;
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
}
export interface IRootMutations {
    'brand/onBrandsStateChange': IMutations['onBrandsStateChange'];
}

export interface IActions {
    fetchBrands: void;
}
export interface IRootActions {
    'brand/fetchBrands': IActions['fetchBrands'];
}
