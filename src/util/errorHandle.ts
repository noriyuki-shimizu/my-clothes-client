import * as Vuex from 'vuex';
import VueRouter from 'vue-router';
import { Modal } from 'ant-design-vue';

export const handleForbiddenError = (
    err: any,
    store: Vuex.ExStore,
    router: VueRouter
) => {
    if (err.response && err.response.status === 403) {
        Modal.warning({
            title: 'Certification expired',
            content: 'Please sign in again.',
            onOk: () => {
                store.commit('brand/allStateReset');
                store.commit('clothes/allStateReset');
                store.commit('coordinate/allStateReset');
                store.commit('genre/allStateReset');
                store.commit('shop/allStateReset');

                store.dispatch('user/signOut');
                router.push({
                    name: 'signIn',
                    params: { again: 'again' }
                });
            }
        });
    }
};
