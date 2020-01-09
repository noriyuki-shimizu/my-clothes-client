import axios, { AxiosRequestConfig, AxiosError } from 'axios';

import store from '@/store';

export const isAxiosError = (err: any): err is AxiosError => {
    return 'isAxiosError' in err;
};

const http = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
});

http.interceptors.request.use(
    async requestConfig => {
        const id = store.getters['user/id'];
        const accessToken = store.getters['user/accessToken'];
        requestConfig.headers = {
            UserId: id,
            Authorization: `Bearer ${accessToken}`
        };
        return requestConfig;
    },
    error => {
        throw error;
    }
);

export default http;
