import { IModuleRootMutations } from '@/store/type';

export interface Genre {
    id?: number;
    name: string;
    color: string;
}

export interface TotalPricePerGenre {
    name: string;
    color: string;
    totalPrice: number;
}

export interface State {
    genres: Genre[];
    totalPricePerGenres: TotalPricePerGenre[];
    canSelectedColors: string[];
}

export interface IGetters {
    genres: Genre[];
    totalPricePerGenres: TotalPricePerGenre[];
    canSelectedColors: string[];
}
export interface IRootGetters {
    'genre/genres': IGetters['genres'];
    'genre/totalPricePerGenres': IGetters['totalPricePerGenres'];
    'genre/canSelectedColors': IGetters['canSelectedColors'];
}

export interface IMutations extends IModuleRootMutations {
    onGenresStateChange: Genre[];
    onTotalPricePerGenreStateChange: TotalPricePerGenre[];
    onCanSelectedColorsStateChange: string[];
    onAddGenre: Genre;
    onUpdateTargetGenre: Genre;
    onDeleteGenre: number;
}
export interface IRootMutations {
    'genre/allStateReset': IMutations['allStateReset'];
    'genre/onGenresStateChange': IMutations['onGenresStateChange'];
    'genre/onTotalPricePerGenreStateChange': IMutations['onTotalPricePerGenreStateChange'];
    'genre/onCanSelectedColorsStateChange': IMutations['onCanSelectedColorsStateChange'];
    'genre/onAddGenre': IMutations['onAddGenre'];
    'genre/onUpdateTargetGenre': IMutations['onUpdateTargetGenre'];
    'genre/onDeleteGenre': IMutations['onDeleteGenre'];
}

export interface IActions {
    fetchGenres: void;
    fetchTotalPricePerGenres: void;
    fetchCanSelectedColorsStateChange: number | '';
    onAddGenre: {
        genre: Pick<Genre, 'name' | 'color'>;
    };
    onUpdateGenre: {
        id: Genre['id'];
        genre: Pick<Genre, 'name' | 'color'>;
    };
    onDeleteGenre: {
        id: Genre['id'];
    };
}
export interface IRootActions {
    'genre/fetchGenres': IActions['fetchGenres'];
    'genre/fetchTotalPricePerGenres': IActions['fetchTotalPricePerGenres'];
    'genre/fetchCanSelectedColorsStateChange': IActions['fetchCanSelectedColorsStateChange'];
    'genre/onAddGenre': IActions['onAddGenre'];
    'genre/onUpdateGenre': IActions['onUpdateGenre'];
    'genre/onDeleteGenre': IActions['onDeleteGenre'];
}
