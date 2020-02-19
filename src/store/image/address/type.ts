import { IModuleRootMutations } from '@/store/type';

export interface State {
    values: string[];
}

export interface IGetters {
    values: string[];
}
export interface IRootGetters {
    'imageAddress/values': IGetters['values'];
}

export interface IMutations extends IModuleRootMutations {
    onValueStateChange: string[];
}
export interface IRootMutations {
    'imageAddress/allStateReset': IMutations['allStateReset'];
    'imageAddress/onValueStateChange': IMutations['onValueStateChange'];
}

export interface IActions {
    fetchImageAddresses: void;
}
export interface IRootActions {
    'imageAddress/fetchImageAddresses': IActions['fetchImageAddresses'];
}
