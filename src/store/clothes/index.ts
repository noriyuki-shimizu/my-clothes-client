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

const state: State = {
    clothes: [],
    assistGenres: [],
    assistBrands: [],
    assistShops: [],
    totalPrice: 0
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
    },
    totalPrice(state) {
        return state.totalPrice;
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset(state) {
        state.assistBrands = [];
        state.assistGenres = [];
        state.assistShops = [];
        state.clothes = [];
    },
    clothesStateChange(state, payload) {
        state.clothes = payload;
    },
    addClothes(state, payload) {
        state.clothes.push(payload);
    },
    updateClothes(state, payload) {
        const { clothes } = state;
        const replaceIndex = clothes.map(c => c.id).indexOf(payload.id);

        const updateValue: Clothes = {
            ...clothes[replaceIndex],
            brand: state.assistBrands.find(
                brand => brand.id === payload.brandId
            ) as AssistBrand,
            shop: state.assistShops.find(
                shop => shop.id === payload.shopId
            ) as AssistShop,
            genres: payload.genreIds.map(
                genreId =>
                    state.assistGenres.find(
                        genre => genre.id === genreId
                    ) as AssistGenre
            ),
            imageLink: payload.imageLink,
            buyDate: payload.buyDate,
            price: payload.price,
            comment: payload.comment,
            satisfaction: payload.satisfaction
        };

        clothes.splice(replaceIndex, 1, updateValue);
        state.clothes = clothes;
    },
    deleteClothes(state, payload) {
        const c = state.clothes.find(c => c.id === payload);
        if (c) {
            c.isDeleted = true;
        }
    },
    restorationClothes(state, payload) {
        const c = state.clothes.find(c => c.id === payload);
        if (c) {
            c.isDeleted = true;
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

        const clothes = ctx.getters['clothes'].find(
            c => c.id === id
        ) as Clothes;
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

        const updateItem = {
            imageId: clothes.imageId,
            imageLink: updateImageLink,
            buyDate: formatBuyDate,
            brandId,
            shopId,
            genreIds,
            price,
            comment,
            satisfaction
        };

        await api.put(
            `/${ctx.rootGetters['user/id']}/clothes/${id}`,
            updateItem
        );

        ctx.commit('updateClothes', {
            id,
            ...updateItem
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
