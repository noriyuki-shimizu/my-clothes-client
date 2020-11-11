import api from '@/plugins/api';
import store from '@/store';
import { handleForbiddenError } from '@/util/errorHandle';
import storageKey from '@/util/storageKey';
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

    const { path } = to;
    sessionStorage.setItem(storageKey.TO_PATH, path);

    api.post(`/${store.getters['user/id']}/routing`, path)
        .then(() => next())
        .catch(err => {
            handleForbiddenError(err, store, next);
        });
};

export default guard;
