import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/coordinate/type';

import api from '@/plugins/api';
import firebaseImageStorage from '@/plugins/firebase/storage/image';

const state: State = {
    coordinates: [],
    coordinateItems: []
};

const getters: Getters<State, IGetters> = {
    coordinates(state) {
        return state.coordinates;
    },
    coordinateItems(state) {
        return state.coordinateItems;
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset(state) {
        state.coordinates = [];
        state.coordinateItems = [];
    },
    onCoordinateStateChange(state, payload) {
        state.coordinates = payload;
    },
    onAddCoordinate(state, payload) {
        state.coordinates.push(payload);
    },
    onUpdateTargetCoordinate(state, payload) {
        state.coordinates = state.coordinates.map(c =>
            c.id === payload.id ? payload : c
        );
    },
    onDeleteCoordinate(state, payload) {
        state.coordinates = state.coordinates.filter(
            coordinate => coordinate.id !== payload
        );
    },
    onAssistCoordinateItemStateChange(state, payload) {
        state.coordinateItems = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchCoordinates(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/coordinates`
        );
        const { data } = response;

        ctx.commit('onCoordinateStateChange', data.coordinates);
    },
    async fetchCoordinateItems(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/clothes/items`
        );
        const { data } = response;

        ctx.commit('onAssistCoordinateItemStateChange', data.assistClothes);
    },
    async onAddCoordinate(ctx, { coordinate, imageFile }) {
        const { season, clothingIds } = coordinate;

        const imageLink = imageFile
            ? await firebaseImageStorage.upload(imageFile, 'coordinate/')
            : null;

        const response = await api.post(
            `/${ctx.rootGetters['user/id']}/coordinates`,
            {
                season,
                imageLink,
                clothingIds
            }
        );

        ctx.commit('onAddCoordinate', response.data.coordinate);
    },
    async onUpdateCoordinate(ctx, { id, coordinate, imageFile }) {
        const { season, imageId, imageLink, clothingIds } = coordinate;
        if (imageLink && imageFile) {
            await firebaseImageStorage.deleteImageByFullPath(imageLink);
        }

        const updateImageLink = imageFile
            ? await firebaseImageStorage.upload(imageFile, 'coordinate/')
            : imageLink;

        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/coordinates/${id}`,
            {
                imageId,
                imageLink: updateImageLink,
                season,
                clothingIds
            }
        );

        ctx.commit('onUpdateTargetCoordinate', response.data.coordinate);
    },
    async onDeleteCoordinate(ctx, id) {
        await api.delete(`/${ctx.rootGetters['user/id']}/coordinates/${id}`);
        ctx.commit('onDeleteCoordinate', id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
