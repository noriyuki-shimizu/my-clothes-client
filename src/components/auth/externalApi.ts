import VueRouter from 'vue-router';
import storageKey from '@/util/storageKey';

export const toHome = (router: VueRouter): void => {
    const path = sessionStorage.getItem(storageKey.TO_PATH);
    if (path) {
        router.push({
            path
        });
        sessionStorage.removeItem(storageKey.TO_PATH);
        return;
    }
    router.push({
        name: 'home'
    });
};

export default {};
