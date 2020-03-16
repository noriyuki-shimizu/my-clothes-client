import { Genre } from '../genre/type';
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
    coordinateStateChange: Coordinate[];
    addCoordinate: Coordinate;
    updateCoordinate: Omit<FormFields, 'image'> &
        Pick<Coordinate, 'id' | 'imageLink'>;
    deleteCoordinate: Coordinate['id'];
    assistCoordinateItemStateChange: CoordinateItem[];
}
export interface IRootMutations {
    'coordinate/allStateReset': IMutations['allStateReset'];
    'coordinate/coordinateStateChange': IMutations['coordinateStateChange'];
    'coordinate/addCoordinate': IMutations['addCoordinate'];
    'coordinate/updateCoordinate': IMutations['updateCoordinate'];
    'coordinate/deleteCoordinate': IMutations['deleteCoordinate'];
    'coordinate/assistCoordinateItemStateChange': IMutations['assistCoordinateItemStateChange'];
}

export interface IActions {
    fetchCoordinates: void;
    fetchCoordinateItems: void;
    onAddCoordinate: FormFields;
    onUpdateCoordinate: FormFields & Pick<Coordinate, 'id'>;
    onDeleteCoordinate: Coordinate['id'];
}
export interface IRootActions {
    'coordinate/fetchCoordinates': IActions['fetchCoordinates'];
    'coordinate/fetchCoordinateItems': IActions['fetchCoordinateItems'];
    'coordinate/onAddCoordinate': IActions['onAddCoordinate'];
    'coordinate/onUpdateCoordinate': IActions['onUpdateCoordinate'];
    'coordinate/onDeleteCoordinate': IActions['onDeleteCoordinate'];
}
