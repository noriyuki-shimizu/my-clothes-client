import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/brand/type';

import api from '@/plugins/api';

const state: State = {
    brands: []
};

const getters: Getters<State, IGetters> = {
    brands(state) {
        return state.brands;
    }
};

const mutations: Mutations<State, IMutations> = {
    onBrandsStateChange(state, payload) {
        state.brands = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchBrands(ctx) {
        const response = await api({
            method: 'GET',
            url: `/${ctx.rootGetters['user/id']}/brands`
        });
        const { data } = response;

        ctx.commit('onBrandsStateChange', data.brands);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
