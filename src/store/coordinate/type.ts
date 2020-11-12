import { FormFields } from '@/components/coordinate/type';
import { ClothesItem } from '@/store/clothes/type';

export interface Coordinate {
    id: number;
    season: string;
    imageId: number;
    imageLink: string;
    usedCoordinates: ClothesItem[];
}

export interface State {
    coordinate: Coordinate;
    coordinates: Coordinate[];
    coordinateItems: ClothesItem[];
}

export interface IGetters {
    coordinate: Coordinate;
    coordinates: Coordinate[];
    coordinateItems: ClothesItem[];
}
export interface IRootGetters {
    'coordinate/coordinate': IGetters['coordinate'];
    'coordinate/coordinates': IGetters['coordinates'];
    'coordinate/coordinateItems': IGetters['coordinateItems'];
}

export interface IMutations {
    resetCoordinate: void;
    coordinateStateChange: Coordinate;
    coordinatesStateChange: Coordinate[];
    addCoordinate: Coordinate;
    deleteCoordinate: Coordinate['id'];
    assistCoordinateItemStateChange: ClothesItem[];
}
export interface IRootMutations {
    'coordinate/resetCoordinate': IMutations['resetCoordinate'];
    'coordinate/coordinateStateChange': IMutations['coordinateStateChange'];
    'coordinate/coordinatesStateChange': IMutations['coordinatesStateChange'];
    'coordinate/addCoordinate': IMutations['addCoordinate'];
    'coordinate/deleteCoordinate': IMutations['deleteCoordinate'];
    'coordinate/assistCoordinateItemStateChange': IMutations['assistCoordinateItemStateChange'];
}

export interface IActions {
    fetchCoordinate: Coordinate['id'];
    fetchCoordinates: void;
    fetchCoordinateItems: void;
    onAddCoordinate: FormFields;
    onUpdateCoordinate: FormFields & Pick<Coordinate, 'id'>;
    onDeleteCoordinate: Coordinate['id'];
}
export interface IRootActions {
    'coordinate/fetchCoordinate': IActions['fetchCoordinate'];
    'coordinate/fetchCoordinates': IActions['fetchCoordinates'];
    'coordinate/fetchCoordinateItems': IActions['fetchCoordinateItems'];
    'coordinate/onAddCoordinate': IActions['onAddCoordinate'];
    'coordinate/onUpdateCoordinate': IActions['onUpdateCoordinate'];
    'coordinate/onDeleteCoordinate': IActions['onDeleteCoordinate'];
}
