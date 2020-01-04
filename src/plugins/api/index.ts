import axios, { AxiosRequestConfig, AxiosError } from 'axios';

import store from '@/store';

export const isAxiosError = (err: any): err is AxiosError => {
    return 'isAxiosError' in err;
};

export default async (option: AxiosRequestConfig) => {
    const http = axios.create({
        baseURL: process.env.VUE_APP_API_BASE_URL
    });

    http.interceptors.request.use(
        async requestConfig => {
            const accessToken = store.getters['user/accessToken'];
            requestConfig.headers.Authorization = `Bearer ${accessToken}`;
            return requestConfig;
        },
        error => {
            throw error;
        }
    );

    return http(option).catch((error: any) => {
        throw error;
    });
};
