import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/clothes/type';

import api from '@/plugins/api';
import firebaseStorage from '@/plugins/firebase/storage';

const state: State = {
    clothes: [],
    assistGenres: [],
    assistBrands: [],
    assistShops: []
};

const getters: Getters<State, IGetters> = {
    clothes(state) {
        return state.clothes;
    },
    assistGenres(state) {
        return state.assistGenres;
    },
    assistBrands(state) {
        return state.assistBrands;
    },
    assistShops(state) {
        return state.assistShops;
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset(state) {
        state.assistBrands = [];
        state.assistGenres = [];
        state.assistShops = [];
        state.clothes = [];
    },
    onClothesStateChange(state, payload) {
        state.clothes = payload;
    },
    onAddClothes(state, payload) {
        state.clothes.push(payload);
    },
    onUpdateTargetClothes(state, payload) {
        state.clothes = state.clothes.map(c =>
            c.id === payload.id ? payload : c
        );
    },
    onAssistGenreStateChange(state, payload) {
        state.assistGenres = payload;
    },
    onAssistBrandStateChange(state, payload) {
        state.assistBrands = payload;
    },
    onAssistShopStateChange(state, payload) {
        state.assistShops = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchClothes(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/clothes`
        );
        const { data } = response;

        ctx.commit('onClothesStateChange', data.clothes);
    },
    async fetchAssistGenres(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/genres/keyValues`
        );
        const { data } = response;

        ctx.commit('onAssistGenreStateChange', data.assistGenres);
    },
    async fetchAssistBrands(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/brands/keyValues`
        );
        const { data } = response;

        ctx.commit('onAssistBrandStateChange', data.assistBrands);
    },
    async fetchAssistShops(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/shops/keyValues`
        );
        const { data } = response;

        ctx.commit('onAssistShopStateChange', data.assistShops);
    },
    async onAddClothes(
        ctx,
        {
            clothes: {
                brandId,
                shopId,
                genreIds,
                price,
                buyDate,
                comment,
                satisfaction
            },
            imageFile
        }
    ) {
        const imageLink = imageFile
            ? await firebaseStorage.image.upload(imageFile, 'clothes/')
            : null;

        const response = await api.post(
            `/${ctx.rootGetters['user/id']}/clothes`,
            {
                brandId,
                imageLink,
                shopId,
                genreIds,
                price,
                buyDate,
                comment,
                satisfaction
            }
        );

        ctx.commit('onAddClothes', response.data.clothes);
    },
    async onUpdateClothes(
        ctx,
        {
            id,
            clothes: {
                imageId,
                imageLink,
                brandId,
                shopId,
                genreIds,
                price,
                buyDate,
                comment,
                satisfaction
            },
            imageFile
        }
    ) {
        if (imageLink && imageFile) {
            await firebaseStorage.image.deleteImageByFullPath(imageLink);
        }

        const updateImageLink = imageFile
            ? await firebaseStorage.image.upload(imageFile, 'clothes/')
            : imageLink;

        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/clothes/${id}`,
            {
                imageId,
                imageLink: updateImageLink,
                brandId,
                shopId,
                genreIds,
                price,
                buyDate,
                comment,
                satisfaction
            }
        );

        ctx.commit('onUpdateTargetClothes', response.data.clothes);
    },
    async onDeleteClothes(ctx, id) {
        const response = await api.delete(
            `/${ctx.rootGetters['user/id']}/clothes/${id}`
        );
        ctx.commit('onUpdateTargetClothes', response.data.clothes);
    },
    async onRestorationClothes(ctx, id) {
        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/clothes/${id}/restoration`
        );
        ctx.commit('onUpdateTargetClothes', response.data.clothes);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
