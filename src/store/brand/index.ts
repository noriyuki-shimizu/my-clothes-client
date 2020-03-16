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
    brandsStateChange(state, payload) {
        state.brands = payload;
    },
    addBrand(state, payload) {
        state.brands.push(payload);
    },
    updateBrand(state, payload) {
        const { brands } = state;
        const replaceIndex = brands.map(brand => brand.id).indexOf(payload.id);

        const updateValue = {
            ...brands[replaceIndex],
            name: payload.name,
            link: payload.link,
            country: payload.country,
            imageLink: payload.imageLink
        };

        brands.splice(replaceIndex, 1, updateValue);
        state.brands = brands;
    },
    deleteBrand(state, payload) {
        const brand = state.brands.find(brand => brand.id === payload);
        if (brand) {
            brand.isDeleted = true;
        }
    },
    restorationBrand(state, payload) {
        const brand = state.brands.find(brand => brand.id === payload);
        if (brand) {
            brand.isDeleted = false;
        }
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
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

        const brand = ctx.getters['brands'].find(b => b.id === id) as Brand;
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

        const updateItem = {
            name,
            link,
            imageId: brand.imageId,
            imageLink,
            country
        };

        await api.put(
            `/${ctx.rootGetters['user/id']}/brands/${id}`,
            updateItem
        );

        ctx.commit('updateBrand', {
            id,
            ...updateItem
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
