import { IModuleRootMutations } from '@/store/type';
import { FormFields } from '@/components/genre/type';

export interface Genre {
    id: number;
    name: string;
    color: string;
}

export interface TotalPricePerGenreData {
    name: string;
    color: string;
    totalPrice: number;
}

export interface State {
    genre: Genre;
    genres: Genre[];
    totalPricePerGenres: TotalPricePerGenreData[];
    canSelectedColors: string[];
}

export interface IGetters {
    genre: Genre;
    genres: Genre[];
    totalPricePerGenres: TotalPricePerGenreData[];
    canSelectedColors: string[];
}
export interface IRootGetters {
    'genre/genre': IGetters['genre'];
    'genre/genres': IGetters['genres'];
    'genre/totalPricePerGenres': IGetters['totalPricePerGenres'];
    'genre/canSelectedColors': IGetters['canSelectedColors'];
}

export interface IMutations extends IModuleRootMutations {
    resetGenre: void;
    genreStateChange: Genre;
    genresStateChange: Genre[];
    totalPricePerGenreStateChange: TotalPricePerGenreData[];
    canSelectedColorsStateChange: string[];
    addGenre: Genre;
    updateTargetGenre: FormFields & Pick<Genre, 'id'>;
    deleteGenre: Genre['id'];
}
export interface IRootMutations {
    'genre/allStateReset': IMutations['allStateReset'];
    'genre/resetGenre': IMutations['resetGenre'];
    'genre/genreStateChange': IMutations['genreStateChange'];
    'genre/genresStateChange': IMutations['genresStateChange'];
    'genre/totalPricePerGenreStateChange': IMutations['totalPricePerGenreStateChange'];
    'genre/canSelectedColorsStateChange': IMutations['canSelectedColorsStateChange'];
    'genre/addGenre': IMutations['addGenre'];
    'genre/updateTargetGenre': IMutations['updateTargetGenre'];
    'genre/deleteGenre': IMutations['deleteGenre'];
}

export interface IActions {
    fetchGenre: Genre['id'];
    fetchGenres: void;
    fetchTotalPricePerGenres: void;
    fetchCanSelectedColorsStateChange: Genre['id'] | null;
    onAddGenre: FormFields;
    onUpdateGenre: FormFields & Pick<Genre, 'id'>;
    onDeleteGenre: Genre['id'];
}
export interface IRootActions {
    'genre/fetchGenre': IActions['fetchGenre'];
    'genre/fetchGenres': IActions['fetchGenres'];
    'genre/fetchTotalPricePerGenres': IActions['fetchTotalPricePerGenres'];
    'genre/fetchCanSelectedColorsStateChange': IActions['fetchCanSelectedColorsStateChange'];
    'genre/onAddGenre': IActions['onAddGenre'];
    'genre/onUpdateGenre': IActions['onUpdateGenre'];
    'genre/onDeleteGenre': IActions['onDeleteGenre'];
}
