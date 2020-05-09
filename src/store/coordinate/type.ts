import { Genre } from '@/store/genre/type';
import { IModuleRootMutations } from '@/store/type';
import { FormFields } from '@/components/coordinate/type';

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
    id: number;
    season: string;
    imageId: number;
    imageLink: string;
    usedCoordinates: CoordinateItem[];
}

export interface State {
    coordinate: Coordinate;
    coordinates: Coordinate[];
    coordinateItems: CoordinateItem[];
}

export interface IGetters {
    coordinate: Coordinate;
    coordinates: Coordinate[];
    coordinateItems: CoordinateItem[];
}
export interface IRootGetters {
    'coordinate/coordinate': IGetters['coordinate'];
    'coordinate/coordinates': IGetters['coordinates'];
    'coordinate/coordinateItems': IGetters['coordinateItems'];
}

export interface IMutations extends IModuleRootMutations {
    resetCoordinate: void;
    coordinateStateChange: Coordinate;
    coordinatesStateChange: Coordinate[];
    addCoordinate: Coordinate;
    updateCoordinate: Omit<FormFields, 'image'> &
        Pick<Coordinate, 'id' | 'imageLink'>;
    deleteCoordinate: Coordinate['id'];
    assistCoordinateItemStateChange: CoordinateItem[];
}
export interface IRootMutations {
    'coordinate/allStateReset': IMutations['allStateReset'];
    'coordinate/resetCoordinate': IMutations['resetCoordinate'];
    'coordinate/coordinateStateChange': IMutations['coordinateStateChange'];
    'coordinate/coordinatesStateChange': IMutations['coordinatesStateChange'];
    'coordinate/addCoordinate': IMutations['addCoordinate'];
    'coordinate/updateCoordinate': IMutations['updateCoordinate'];
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
