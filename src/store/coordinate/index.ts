import { Getters, Mutations, Actions } from 'vuex';
import {
    State,
    IGetters,
    IMutations,
    IActions,
    Coordinate
} from '@/store/coordinate/type';

import api from '@/plugins/api';
import firebaseStorage from '@/plugins/firebase/storage';
import { AppUser } from '@/store/user/type';

export const initCoordinate = (): Coordinate => ({
    id: 0,
    season: '',
    imageId: 0,
    imageLink: '',
    usedCoordinates: []
});

const state: State = {
    coordinate: initCoordinate(),
    coordinates: [],
    coordinateItems: []
};

const getters: Getters<State, IGetters> = {
    coordinate(state) {
        return state.coordinate;
    },
    coordinates(state) {
        return state.coordinates;
    },
    coordinateItems(state) {
        return state.coordinateItems;
    }
};

const mutations: Mutations<State, IMutations> = {
    resetCoordinate(state) {
        state.coordinate = initCoordinate();
    },
    coordinateStateChange(state, payload) {
        state.coordinate = payload;
    },
    coordinatesStateChange(state, payload) {
        state.coordinates = payload;
    },
    addCoordinate(state, payload) {
        state.coordinates.push(payload);
    },
    deleteCoordinate(state, payload) {
        state.coordinates = state.coordinates.filter(
            coordinate => coordinate.id !== payload
        );
    },
    assistCoordinateItemStateChange(state, payload) {
        state.coordinateItems = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchCoordinate(ctx, id) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/coordinates/${id}`
        );
        const { data } = response;

        ctx.commit('coordinateStateChange', data.coordinate);
    },
    async fetchCoordinates(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/coordinates`
        );
        const { data } = response;

        ctx.commit('coordinatesStateChange', data.coordinates);
    },
    async fetchCoordinateItems(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/clothes/items`
        );
        const { data } = response;

        ctx.commit('assistCoordinateItemStateChange', data.assistClothes);
    },
    async onAddCoordinate(ctx, formFields) {
        const { season, clothingIds, image } = formFields;
        const imageFile = image && image.file ? image.file.originFileObj : null;

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const imageLink = imageFile
            ? await firebaseStorage.image.upload(
                  imageFile,
                  currentUser.uid,
                  'coordinate'
              )
            : null;

        const response = await api.post<{ coordinate: Coordinate }>(
            `/${ctx.rootGetters['user/id']}/coordinates`,
            {
                season,
                imageLink,
                clothingIds
            }
        );

        ctx.commit('addCoordinate', response.data.coordinate);
    },
    async onUpdateCoordinate(ctx, updateValue) {
        const { id, season, clothingIds, image } = updateValue;
        const imageFile = image && image.file ? image.file.originFileObj : null;

        const { imageId, imageLink } = ctx.getters['coordinates'].find(
            c => c.id === id
        ) as Coordinate;
        if (imageLink && imageFile) {
            await firebaseStorage.image.deleteImageByFullPath(imageLink);
        }

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const updateImageLink = imageFile
            ? await firebaseStorage.image.upload(
                  imageFile,
                  currentUser.uid,
                  'coordinate'
              )
            : imageLink;

        await api.put(`/${ctx.rootGetters['user/id']}/coordinates/${id}`, {
            imageId,
            imageLink: updateImageLink,
            season,
            clothingIds
        });
    },
    async onDeleteCoordinate(ctx, id) {
        await api.delete(`/${ctx.rootGetters['user/id']}/coordinates/${id}`);
        ctx.commit('deleteCoordinate', id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
