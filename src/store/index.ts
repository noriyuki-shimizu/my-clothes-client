import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from '@/store/user';
import imageAddress from '@/store/image/address';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        imageAddress
    },
    plugins: [
        createPersistedState({
            key: 'mcm-client'
        })
    ]
});
