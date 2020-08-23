import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions, Shop } from '@/store/shop/type';

import api from '@/plugins/api';
import firebaseStorage from '@/plugins/firebase/storage';
import { AppUser } from '@/store/user/type';
import { timeFormat } from '@/util/date';

export const initShop = (): Shop => ({
    id: 0,
    name: '',
    link: null,
    stationName: '',
    imageId: null,
    imageLink: null,
    address: '',
    businessHours: '',
    isBusinessStatus: false,
    tel: '',
    isDeleted: false
});

const state: State = {
    shop: initShop(),
    shops: []
};

const getters: Getters<State, IGetters> = {
    shop(state) {
        return state.shop;
    },
    shops(state) {
        return state.shops;
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset(state) {
        state.shops = [];
    },
    resetShop(state) {
        state.shop = initShop();
    },
    shopStateChange(state, payload) {
        state.shop = payload;
    },
    shopsStateChange(state, payload) {
        state.shops = payload;
    },
    addShop(state, payload) {
        state.shops.push(payload);
    },
    updateShop(state, payload) {
        const { shops } = state;
        const replaceIndex = shops.map(shop => shop.id).indexOf(payload.id);

        const updateValue = {
            ...shops[replaceIndex],
            imageLink: payload.imageLink,
            businessHours: payload.businessHours,
            name: payload.name,
            link: payload.link,
            stationName: payload.stationName,
            address: payload.address,
            tel: payload.tel
        };

        shops.splice(replaceIndex, 1, updateValue);
        state.shops = shops;
    },
    deleteShop(state, payload) {
        const shop = state.shops.find(shop => shop.id === payload);
        if (shop) {
            shop.isDeleted = true;
        }
    },
    restorationShop(state, payload) {
        const shop = state.shops.find(shop => shop.id === payload);
        if (shop) {
            shop.isDeleted = false;
        }
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchShop(ctx, id) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/shops/${id}`
        );
        const { data } = response;

        ctx.commit('shopStateChange', data.shop);
    },
    async fetchShops(ctx) {
        const response = await api.get(`/${ctx.rootGetters['user/id']}/shops`);
        const { data } = response;

        ctx.commit('shopsStateChange', data.shops);
    },
    async onAddShop(ctx, formFields) {
        const {
            name,
            image,
            link,
            stationName,
            address,
            startBusinessHours,
            endBusinessHours,
            tel
        } = formFields;

        const imageFile = image && image.file ? image.file.originFileObj : null;

        const businessHours = `${startBusinessHours.format(
            timeFormat
        )}~${endBusinessHours.format(timeFormat)}`;

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const imageLink = imageFile
            ? await firebaseStorage.image.upload(
                  imageFile,
                  currentUser.uid,
                  'shop'
              )
            : null;

        const response = await api.post<{ shop: Shop }>(
            `/${ctx.rootGetters['user/id']}/shops`,
            {
                name,
                link,
                stationName,
                address,
                businessHours,
                tel,
                imageLink
            }
        );

        ctx.commit('addShop', response.data.shop);
    },
    async onUpdateShop(ctx, updateValue) {
        const {
            id,
            name,
            image,
            link,
            stationName,
            address,
            startBusinessHours,
            endBusinessHours,
            tel
        } = updateValue;

        const imageFile = image && image.file ? image.file.originFileObj : null;

        const businessHours = `${startBusinessHours.format(
            timeFormat
        )}~${endBusinessHours.format(timeFormat)}`;

        const shop = ctx.getters['shops'].find(s => s.id === id) as Shop;
        if (shop.imageLink && imageFile) {
            await firebaseStorage.image.deleteImageByFullPath(shop.imageLink);
        }

        const currentUser = ctx.rootGetters['user/currentUser'] as AppUser;
        const updateImageLink = imageFile
            ? await firebaseStorage.image.upload(
                  imageFile,
                  currentUser.uid,
                  'shop'
              )
            : shop.imageLink;

        const updateItem = {
            name,
            link,
            stationName,
            imageId: shop.imageId,
            imageLink: updateImageLink,
            address,
            businessHours,
            tel
        };

        await api.put(`/${ctx.rootGetters['user/id']}/shops/${id}`, updateItem);

        ctx.commit('updateShop', {
            id,
            ...updateItem
        });
    },
    async onDeleteShop(ctx, id) {
        await api.delete(`/${ctx.rootGetters['user/id']}/shops/${id}`);
        ctx.commit('deleteShop', id);
    },
    async onRestorationShop(ctx, id) {
        await api.put(`/${ctx.rootGetters['user/id']}/shops/${id}/restoration`);
        ctx.commit('restorationShop', id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
