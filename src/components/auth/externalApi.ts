import VueRouter from 'vue-router';
import { isMobile } from '@/util/userAgent';

export const toHome = (
    next: string | (string | null)[],
    router: VueRouter
): void => {
    if (next === 'back') {
        router.back();
        return;
    }
    router.push({
        name: isMobile() ? 'mobileHome' : 'home'
    });
};

export default {};
