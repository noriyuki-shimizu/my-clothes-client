import axios from 'axios';

import store from '@/store';

const http = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
});

http.interceptors.request.use(
    async (requestConfig) => {
        const id = store.getters['user/id'];
        const accessToken = store.getters['user/accessToken'];

        return {
            ...requestConfig,
            headers: {
                UserId: id,
                Authorization: `Bearer ${accessToken}`
            }
        };
    },
    (error) => {
        throw error;
    }
);

export default http;
