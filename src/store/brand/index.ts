/* eslint-disable no-shadow */
import { Getters, Mutations, Actions } from 'vuex';
import {
    State,
    IGetters,
    IMutations,
    IActions,
    Brand
} from '@/store/brand/type';

import api from '@/plugins/api';
import firebaseStorage from '@/plugins/firebase/storage';
import { AppUser } from '@/store/user/type';

export const initBrand = (): Brand => ({
    id: 0,
    name: '',
    link: '',
    imageId: 0,
    imageLink: '',
    country: '',
    isDeleted: false
});

const state: State = {
    brand: initBrand(),
    brands: []
};

const getters: Getters<State, IGetters> = {
    brand(state) {
        return state.brand;
    },
    brands(state) {
        return state.brands;
    }
};

const mutations: Mutations<State, IMutations> = {
    resetBrand(state) {
        state.brand = initBrand();
    },
    brandStateChange(state, payload) {
        state.brand = payload;
    },
    brandsStateChange(state, payload) {
        state.brands = payload;
    },
    addBrand(state, payload) {
        state.brands.push(payload);
    },
    deleteBrand(state, payload) {
        const brand = state.brands.find((brand) => brand.id === payload);
        if (brand) {
            brand.isDeleted = true;
        }
    },
    restorationBrand(state, payload) {
        const brand = state.brands.find((brand) => brand.id === payload);
        if (brand) {
            brand.isDeleted = false;
        }
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchBrand(ctx, id) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/brands/${id}`
        );
        const { data } = response;

        ctx.commit('brandStateChange', data.brand);
    },
    async fetchBrands(ctx) {
        const response = await api.get(`/${ctx.rootGetters['user/id']}/brands`);
        const { data } = response;

        ctx.commit('brandsStateChange', data.brands);
    },
    async onAddBrand(ctx, formFields) {
        const { name, image, link, country } = formFields;
        const imageFile = image && image.file ? image.file.originFileObj : null;

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const imageLink = imageFile
            ? await firebaseStorage.image.upload(
                imageFile,
                currentUser.uid,
                'brand'
            )
            : null;

        const response = await api.post<{ brand: Brand }>(
            `/${ctx.rootGetters['user/id']}/brands`,
            {
                name,
                link,
                country,
                imageLink
            }
        );

        ctx.commit('addBrand', response.data.brand);
    },
    async onUpdateBrand(ctx, updateValue) {
        const { id, name, image, link, country } = updateValue;
        const imageFile = image && image.file ? image.file.originFileObj : null;

        const brand = ctx.getters.brands.find((b) => b.id === id) as Brand;
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

        await api.put(`/${ctx.rootGetters['user/id']}/brands/${id}`, {
            name,
            link,
            imageId: brand.imageId,
            imageLink,
            country
        });
    },
    async onDeleteBrand(ctx, id) {
        await api.delete(`/${ctx.rootGetters['user/id']}/brands/${id}`);
        ctx.commit('deleteBrand', id);
    },
    async onRestorationBrand(ctx, id) {
        await api.put(
            `/${ctx.rootGetters['user/id']}/brands/${id}/restoration`
        );
        ctx.commit('restorationBrand', id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
