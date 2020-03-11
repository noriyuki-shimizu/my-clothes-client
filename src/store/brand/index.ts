import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/brand/type';

import api from '@/plugins/api';
import firebaseStorage from '@/plugins/firebase/storage';

const state: State = {
    brands: []
};

const getters: Getters<State, IGetters> = {
    brands(state) {
        return state.brands;
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset(state) {
        state.brands = [];
    },
    onBrandsStateChange(state, payload) {
        state.brands = payload;
    },
    onAddBrand(state, payload) {
        state.brands.push(payload);
    },
    onUpdateTargetBrand(state, payload) {
        state.brands = state.brands.map(brand =>
            brand.id === payload.id ? payload : brand
        );
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchBrands(ctx) {
        const response = await api.get(`/${ctx.rootGetters['user/id']}/brands`);
        const { data } = response;

        ctx.commit('onBrandsStateChange', data.brands);
    },
    async onAddBrand(ctx, { brand, imageFile }) {
        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const imageLink = imageFile
            ? await firebaseStorage.image.upload(
                  imageFile,
                  currentUser.uid,
                  'brand'
              )
            : null;

        const response = await api.post(
            `/${ctx.rootGetters['user/id']}/brands`,
            {
                ...brand,
                imageLink
            }
        );

        ctx.commit('onAddBrand', response.data.brand);
    },
    async onUpdateBrand(ctx, { id, brand, imageFile }) {
        if (brand.imageLink && imageFile) {
            await firebaseStorage.image.deleteImageByFullPath(brand.imageLink);
        }

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const imageLink = imageFile
            ? await firebaseStorage.image.upload(
                  imageFile,
                  currentUser.uid,
                  'brand/'
              )
            : brand.imageLink;

        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/brands/${id}`,
            {
                ...brand,
                imageLink
            }
        );

        ctx.commit('onUpdateTargetBrand', response.data.brand);
    },
    async onDeleteBrand(ctx, id) {
        const response = await api.delete(
            `/${ctx.rootGetters['user/id']}/brands/${id}`
        );
        ctx.commit('onUpdateTargetBrand', response.data.brand);
    },
    async onRestorationBrand(ctx, id) {
        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/brands/${id}/restoration`
        );
        ctx.commit('onUpdateTargetBrand', response.data.brand);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
