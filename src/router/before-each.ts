import api from '@/plugins/api';
import store from '@/store';
import { handleForbiddenError } from '@/util/errorHandle';
import Vue from 'vue';
import { NavigationGuard, RouteRecord } from 'vue-router';

const isRequiresAuth = (record: RouteRecord): boolean =>
    record.meta.requiresAuth;

const guard: NavigationGuard<Vue> = (to, _, next) => {
    if (!to.matched.some(isRequiresAuth)) {
        next();
        return;
    }

    if (!store.getters['user/currentUser']) {
        next({ name: 'signIn' });
        return;
    }

    api.post(`/${store.getters['user/id']}/routing`, to.fullPath)
        .then(() => next())
        .catch(err => {
            handleForbiddenError(err, store, next);
        });
};

export default guard;
