import axios from 'axios';
import * as Vuex from 'vuex';

const store: Vuex.ExStore = require('@/store');

const http = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
});

/* TODO: ユーザの store 作成後、以下の↓処理を完成させる */
// http.interceptors.request.use(
//     requestConfig => {
//         const token: string =
//             store.getters[`${config.vuex.namespace.auths}/token`];
//         if (token) {
//             requestConfig.headers.Authorization = `Bearer ${token}`;
//             return requestConfig;
//         }
//         return requestConfig;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );

export default async (option: any) => {
    return http(option)
        .catch((error: any) => {
            throw error;
        });
};
