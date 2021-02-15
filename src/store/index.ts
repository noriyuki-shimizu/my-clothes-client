import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

import user from '@/store/user';
import brand, { initBrand } from '@/store/brand';
import genre, { initGenre } from '@/store/genre';
import shop, { initShop } from '@/store/shop';
import clothes, { initClothes } from '@/store/clothes';
import coordinate, { initCoordinate } from '@/store/coordinate';

Vue.use(Vuex);

export default new Vuex.Store({
    mutations: {
        allStateReset: (state) => {
            // brand
            state.brand = {
                brand: initBrand(),
                brands: []
            };

            // clothes
            state.clothes = {
                assistBrands: [],
                assistGenres: [],
                assistShops: [],
                clothes: [],
                item: initClothes(),
                totalPrice: 0
            };

            // coordinate
            state.coordinate = {
                coordinate: initCoordinate(),
                coordinateItems: [],
                coordinates: []
            };

            // genre
            state.genre = {
                canSelectedColors: [],
                genre: initGenre(),
                genres: [],
                totalPricePerGenres: []
            };

            // shop
            state.shop = {
                shop: initShop(),
                shops: []
            };

            // user
            state.user = {
                id: null,
                user: null,
                accessToken: ''
            };
        }
    },
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
                getItem: (key) => Cookies.get(key),
                setItem: (key, value) =>
                    Cookies.set(key, value, { expires: 1 / 2, secure: false }),
                removeItem: (key) => Cookies.remove(key)
            }
        })
    ]
});
