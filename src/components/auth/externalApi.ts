import VueRouter from 'vue-router';

export const toHome = (
    next: string | (string | null)[],
    router: VueRouter
): void => {
    if (next === 'back') {
        router.back();
        return;
    }
    router.push({ name: 'home' });
};

export default {};
