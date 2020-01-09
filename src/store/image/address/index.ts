import { Getters, Mutations, Actions } from 'vuex';
import {
    State,
    IGetters,
    IMutations,
    IActions
} from '@/store/image/address/type';

import api from '@/plugins/api';

const state: State = {
    values: []
};

const getters: Getters<State, IGetters> = {
    values(state) {
        return state.values;
    }
};

const mutations: Mutations<State, IMutations> = {
    onValueStateChange(state, payload) {
        state.values = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchImageAddresses(ctx) {
        const response = await api.get('/images/street-fashion-snap/addresses');
        const { data } = response;

        ctx.commit(
            'onValueStateChange',
            data && data.imageAddresses ? data.imageAddresses : []
        );
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
