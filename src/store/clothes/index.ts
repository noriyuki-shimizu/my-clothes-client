/* eslint-disable no-shadow */
import { Getters, Mutations, Actions } from 'vuex';
import {
    State,
    IGetters,
    IMutations,
    IActions,
    Clothes,
    AssistBrand,
    AssistShop,
    AssistGenre
} from '@/store/clothes/type';

import api from '@/plugins/api';
import firebaseStorage from '@/plugins/firebase/storage';
import { AppUser } from '@/store/user/type';
import { dateFormat } from '@/util/date';
import { initBrand } from '@/store/brand';
import { initShop } from '@/store/shop';

export const initClothes = (): Clothes => ({
    id: 0,
    imageId: null,
    imageLink: null,
    brand: initBrand(),
    shop: initShop(),
    genres: [],
    price: 0,
    buyDate: '',
    comment: null,
    satisfaction: null,
    isDeleted: false
});

const state: State = {
    item: initClothes(),
    clothes: [],
    assistGenres: [],
    assistBrands: [],
    assistShops: [],
    totalPrice: 0
};

const getters: Getters<State, IGetters> = {
    item(state) {
        return state.item;
    },
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
    },
    totalPrice(state) {
        return state.totalPrice;
    }
};

const mutations: Mutations<State, IMutations> = {
    resetItem(state) {
        state.item = initClothes();
    },
    itemStateChange(state, payload) {
        state.item = payload;
    },
    clothesStateChange(state, payload) {
        state.clothes = payload;
    },
    addClothes(state, payload) {
        state.clothes.push(payload);
    },
    deleteClothes(state, payload) {
        const c = state.clothes.find((c) => c.id === payload);
        if (c) {
            c.isDeleted = true;
        }
    },
    restorationClothes(state, payload) {
        const c = state.clothes.find((c) => c.id === payload);
        if (c) {
            c.isDeleted = false;
        }
    },
    assistGenreStateChange(state, payload) {
        state.assistGenres = payload;
    },
    assistBrandStateChange(state, payload) {
        state.assistBrands = payload;
    },
    assistShopStateChange(state, payload) {
        state.assistShops = payload;
    },
    totalPriceStateChange(state, payload) {
        state.totalPrice = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchOne(ctx, id) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/clothes/${id}`
        );
        const { data } = response;

        ctx.commit('itemStateChange', data.clothes);
    },
    async fetchClothes(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/clothes`
        );
        const { data } = response;

        ctx.commit('clothesStateChange', data.clothes);
    },
    async fetchAssistGenres(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/genres/keyValues`
        );
        const { data } = response;

        ctx.commit('assistGenreStateChange', data.assistGenres);
    },
    async fetchAssistBrands(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/brands/keyValues`
        );
        const { data } = response;

        ctx.commit('assistBrandStateChange', data.assistBrands);
    },
    async fetchAssistShops(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/shops/keyValues`
        );
        const { data } = response;

        ctx.commit('assistShopStateChange', data.assistShops);
    },
    async fetchTotalPrice(ctx) {
        const response = await api.get<number>(
            `/${ctx.rootGetters['user/id']}/clothes/total-price`
        );
        const { data } = response;

        ctx.commit('totalPriceStateChange', data);
    },
    async onAddClothes(ctx, formFields) {
        const {
            image,
            brandId,
            shopId,
            genreIds,
            price,
            buyDate,
            comment,
            satisfaction
        } = formFields;

        const imageFile = image && image.file ? image.file.originFileObj : null;
        const formatBuyDate = buyDate.format(dateFormat);

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const imageLink = imageFile
            ? await firebaseStorage.image.upload(
                imageFile,
                currentUser.uid,
                'clothes'
            )
            : null;

        const response = await api.post<{ clothes: Clothes }>(
            `/${ctx.rootGetters['user/id']}/clothes`,
            {
                imageLink,
                buyDate: formatBuyDate,
                brandId,
                shopId,
                genreIds,
                price,
                comment,
                satisfaction
            }
        );

        ctx.commit('addClothes', response.data.clothes);
    },
    async onUpdateClothes(ctx, updateValue) {
        const {
            id,
            image,
            brandId,
            shopId,
            genreIds,
            price,
            buyDate,
            comment,
            satisfaction
        } = updateValue;

        const imageFile = image && image.file ? image.file.originFileObj : null;

        const formatBuyDate = buyDate.format(dateFormat);

        const clothes = ctx.getters.clothes.find((c) => c.id === id) as Clothes;
        const { imageLink } = clothes;
        if (imageLink && imageFile) {
            await firebaseStorage.image.deleteImageByFullPath(imageLink);
        }

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const updateImageLink = imageFile
            ? await firebaseStorage.image.upload(
                imageFile,
                currentUser.uid,
                'clothes'
            )
            : imageLink;

        await api.put(`/${ctx.rootGetters['user/id']}/clothes/${id}`, {
            imageId: clothes.imageId,
            imageLink: updateImageLink,
            buyDate: formatBuyDate,
            brandId,
            shopId,
            genreIds,
            price,
            comment,
            satisfaction
        });
    },
    async onDeleteClothes(ctx, id) {
        await api.delete(`/${ctx.rootGetters['user/id']}/clothes/${id}`);
        ctx.commit('deleteClothes', id);
    },
    async onRestorationClothes(ctx, id) {
        await api.put(
            `/${ctx.rootGetters['user/id']}/clothes/${id}/restoration`
        );
        ctx.commit('restorationClothes', id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
