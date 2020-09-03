import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

import user from '@/store/user';
import brand from '@/store/brand';
import genre from '@/store/genre';
import shop from '@/store/shop';
import clothes from '@/store/clothes';
import coordinate from '@/store/coordinate';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        brand,
        genre,
        shop,
        clothes,
        coordinate
    },
    plugins: [
        createPersistedState({
            key: 'mcm-item',
            paths: ['brand', 'genre', 'shop', 'clothes', 'coordinate'],
            storage: window.sessionStorage
        }),
        createPersistedState({
            key: 'mcm-auth',
            paths: ['user'],
            storage: {
                getItem: key => Cookies.get(key),
                setItem: (key, value) =>
                    Cookies.set(key, value, { expires: 1 / 2, secure: false }),
                removeItem: key => Cookies.remove(key)
            }
        })
    ]
});
