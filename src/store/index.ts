import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from '@/store/user';
import imageAddress from '@/store/image/address';
import brand from '@/store/brand';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        imageAddress,
        brand
    },
    plugins: [
        createPersistedState({
            key: 'mcm-client'
        })
    ]
});
