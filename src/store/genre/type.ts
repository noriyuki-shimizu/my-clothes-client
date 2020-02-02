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
}

export interface IGetters {
    genres: Genre[];
    totalPricePerGenres: TotalPricePerGenre[];
}
export interface IRootGetters {
    'genre/genres': IGetters['genres'];
    'genre/totalPricePerGenres': IGetters['totalPricePerGenres'];
}

export interface IMutations {
    onGenresStateChange: Genre[];
    onTotalPricePerGenreStateChange: TotalPricePerGenre[];
    onAddGenre: Genre;
    onUpdateTargetGenre: Genre;
    onDeleteGenre: number;
}
export interface IRootMutations {
    'genre/onGenresStateChange': IMutations['onGenresStateChange'];
    'genre/onTotalPricePerGenreStateChange': IMutations['onTotalPricePerGenreStateChange'];
    'genre/onAddGenre': IMutations['onAddGenre'];
    'genre/onUpdateTargetGenre': IMutations['onUpdateTargetGenre'];
    'genre/onDeleteGenre': IMutations['onDeleteGenre'];
}

export interface IActions {
    fetchGenres: void;
    fetchTotalPricePerGenres: void;
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
    'genre/onAddGenre': IActions['onAddGenre'];
    'genre/onUpdateGenre': IActions['onUpdateGenre'];
    'genre/onDeleteGenre': IActions['onDeleteGenre'];
}
