import { Genre } from '../genre/type';
import { IModuleRootMutations } from '@/store/type';

export interface CoordinateItem {
    id: number;
    imageLink: string;
    brandName: string;
    shopName: string;
    genres: Pick<Genre, 'name' | 'color'>[];
    price: number;
    buyDate: string;
    comment: string;
    satisfaction: number;
}

export interface Coordinate {
    id?: number;
    season: string;
    imageId: number;
    imageLink: string;
    usedCoordinates: CoordinateItem[];
}

export interface State {
    coordinates: Coordinate[];
    coordinateItems: CoordinateItem[];
}

export interface IGetters {
    coordinates: Coordinate[];
    coordinateItems: CoordinateItem[];
}
export interface IRootGetters {
    'coordinate/coordinates': IGetters['coordinates'];
    'coordinate/coordinateItems': IGetters['coordinateItems'];
}

export interface IMutations extends IModuleRootMutations {
    onCoordinateStateChange: Coordinate[];
    onAddCoordinate: Coordinate;
    onUpdateTargetCoordinate: Coordinate;
    onDeleteCoordinate: number;
    onAssistCoordinateItemStateChange: CoordinateItem[];
}
export interface IRootMutations {
    'coordinate/allStateReset': IMutations['allStateReset'];
    'coordinate/onCoordinateStateChange': IMutations['onCoordinateStateChange'];
    'coordinate/onAddCoordinate': IMutations['onAddCoordinate'];
    'coordinate/onUpdateTargetCoordinate': IMutations['onUpdateTargetCoordinate'];
    'coordinate/onDeleteCoordinate': IMutations['onDeleteCoordinate'];
    'coordinate/onAssistCoordinateItemStateChange': IMutations['onAssistCoordinateItemStateChange'];
}

export interface IActions {
    fetchCoordinates: void;
    fetchCoordinateItems: void;
    onAddCoordinate: {
        coordinate: {
            season: Coordinate['season'];
            clothingIds: CoordinateItem['id'][];
        };
        imageFile: File | null;
    };
    onUpdateCoordinate: {
        id: Coordinate['id'];
        coordinate: Pick<Coordinate, 'season' | 'imageId' | 'imageLink'> & {
            clothingIds: CoordinateItem['id'][];
        };
        imageFile: File | null;
    };
    onDeleteCoordinate: number;
}
export interface IRootActions {
    'coordinate/fetchCoordinates': IActions['fetchCoordinates'];
    'coordinate/fetchCoordinateItems': IActions['fetchCoordinateItems'];
    'coordinate/onAddCoordinate': IActions['onAddCoordinate'];
    'coordinate/onUpdateCoordinate': IActions['onUpdateCoordinate'];
    'coordinate/onDeleteCoordinate': IActions['onDeleteCoordinate'];
}
