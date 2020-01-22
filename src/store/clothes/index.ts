import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/clothes/type';

import api from '@/plugins/api';
import firebaseImageStorage from '@/plugins/firebase/storage/image';

const state: State = {
    clothes: []
};

const getters: Getters<State, IGetters> = {
    clothes(state) {
        return state.clothes;
    }
};

const mutations: Mutations<State, IMutations> = {
    onClothesStateChange(state, payload) {
        state.clothes = payload;
    },
    onAddClothes(state, payload) {
        state.clothes.push(payload);
    },
    onUpdateTargetClothes(state, payload) {
        state.clothes = state.clothes.map(clothes =>
            clothes.id === payload.id ? payload : clothes
        );
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
    async onAddClothes(
        ctx,
        {
            brandId,
            shopId,
            genreIds,
            price,
            buyDate,
            comment,
            satisfaction,
            imageFile
        }
    ) {
        const imageLink = imageFile
            ? await firebaseImageStorage.upload(imageFile, 'clothes/')
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
            imageId,
            imageLink,
            brandId,
            shopId,
            genreIds,
            price,
            buyDate,
            comment,
            satisfaction,
            imageFile
        }
    ) {
        if (imageLink && imageFile) {
            await firebaseImageStorage.deleteImageByFullPath(imageLink);
        }

        const updateImageLink = imageFile
            ? await firebaseImageStorage.upload(imageFile, 'clothes/')
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
    async onDeleteClothes(ctx, { id }) {
        const response = await api.delete(
            `/${ctx.rootGetters['user/id']}/clothes/${id}`
        );
        ctx.commit('onUpdateTargetClothes', response.data.clothes);
    },
    async onRestorationClothes(ctx, { id }) {
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
