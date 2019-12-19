import axios from 'axios';
import store from '@/store';

const http = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
});

/* TODO: ユーザの store 作成後、以下の↓処理を完成させる */
http.interceptors.request.use(
    async requestConfig => {
        const user: firebase.User | null = store.getters['user/currentUser'];

        if (user) {
            const token = await user.getIdToken(true);
            requestConfig.headers.Authorization = `Bearer ${token}`;
            return requestConfig;
        }
        return requestConfig;
    },
    error => {
        return Promise.reject(error);
    }
);

export default async (option: any) => {
    return http(option).catch((error: any) => {
        throw error;
    });
};
