import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from '@/store/user';
import imageAddress from '@/store/image/address';
import brand from '@/store/brand';
import genre from '@/store/genre';
import shop from '@/store/shop';
import clothes from '@/store/clothes';
import coordinate from '@/store/coordinate';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        imageAddress,
        brand,
        genre,
        shop,
        clothes,
        coordinate
    },
    plugins: [
        createPersistedState({
            key: 'mcm-client',
            storage: window.sessionStorage
        })
    ]
});
