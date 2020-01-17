import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from '@/store/user';
import imageAddress from '@/store/image/address';
import brand from '@/store/brand';
import genre from '@/store/genre';
import shop from '@/store/shop';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        imageAddress,
        brand,
        genre,
        shop
    },
    plugins: [
        createPersistedState({
            key: 'mcm-client'
        })
    ]
});
