export interface Genre {
    id?: number;
    name: string;
    color: string;
}

export interface State {
    genres: Genre[];
}

export interface IGetters {
    genres: Genre[];
}
export interface IRootGetters {
    'genre/genres': IGetters['genres'];
}

export interface IMutations {
    onGenresStateChange: Genre[];
    onAddGenre: Genre;
    onUpdateTargetGenre: Genre;
    onDeleteGenre: number;
}
export interface IRootMutations {
    'genre/onGenresStateChange': IMutations['onGenresStateChange'];
    'genre/onAddGenre': IMutations['onAddGenre'];
    'genre/onUpdateTargetGenre': IMutations['onUpdateTargetGenre'];
    'genre/onDeleteGenre': IMutations['onDeleteGenre'];
}

export interface IActions {
    fetchGenres: void;
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
    'genre/onAddGenre': IActions['onAddGenre'];
    'genre/onUpdateGenre': IActions['onUpdateGenre'];
    'genre/onDeleteGenre': IActions['onDeleteGenre'];
}
