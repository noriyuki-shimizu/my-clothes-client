import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/shop/type';

import api from '@/plugins/api';
import firebaseImageStorage from '@/plugins/firebase/storage/image';

const state: State = {
    shops: []
};

const getters: Getters<State, IGetters> = {
    shops(state) {
        return state.shops;
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset(state) {
        state.shops = [];
    },
    onShopsStateChange(state, payload) {
        state.shops = payload;
    },
    onAddShop(state, payload) {
        state.shops.push(payload);
    },
    onUpdateTargetShop(state, payload) {
        state.shops = state.shops.map(shop =>
            shop.id === payload.id ? payload : shop
        );
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchShops(ctx) {
        const response = await api.get(`/${ctx.rootGetters['user/id']}/shops`);
        const { data } = response;

        ctx.commit('onShopsStateChange', data.shops);
    },
    async onAddShop(
        ctx,
        { name, link, stationName, address, businessHours, tel, imageFile }
    ) {
        const imageLink = imageFile
            ? await firebaseImageStorage.upload(imageFile, 'shop/')
            : null;

        const response = await api.post(
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

        ctx.commit('onAddShop', response.data.shop);
    },
    async onUpdateShop(
        ctx,
        {
            id,
            name,
            link,
            stationName,
            imageId,
            imageLink,
            address,
            businessHours,
            tel,
            imageFile
        }
    ) {
        if (imageLink && imageFile) {
            await firebaseImageStorage.deleteImageByFullPath(imageLink);
        }

        const updateImageLink = imageFile
            ? await firebaseImageStorage.upload(imageFile, 'shop/')
            : imageLink;

        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/shops/${id}`,
            {
                name,
                link,
                stationName,
                imageId,
                address,
                businessHours,
                tel,
                imageLink: updateImageLink
            }
        );

        ctx.commit('onUpdateTargetShop', response.data.shop);
    },
    async onDeleteShop(ctx, { id }) {
        const response = await api.delete(
            `/${ctx.rootGetters['user/id']}/shops/${id}`
        );
        ctx.commit('onUpdateTargetShop', response.data.shop);
    },
    async onRestorationShop(ctx, { id }) {
        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/shops/${id}/restoration`
        );
        ctx.commit('onUpdateTargetShop', response.data.shop);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
