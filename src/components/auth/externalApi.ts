import VueRouter from 'vue-router';

export const toHome = (again: string, router: VueRouter): void => {
    if (again) {
        router.back();
        return;
    }
    router.push({ name: 'home' });
};
