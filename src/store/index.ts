import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from '@/store/user';
import imageAddress from '@/store/image/address';
import brand from '@/store/brand';
import genre from '@/store/genre';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        imageAddress,
        brand,
        genre
    },
    plugins: [
        createPersistedState({
            key: 'mcm-client'
        })
    ]
});
