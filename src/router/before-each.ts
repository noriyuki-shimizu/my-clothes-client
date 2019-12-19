import Vue from 'vue';
import { NavigationGuard, RouteRecord } from 'vue-router';
import store from '@/store';

const isRequiresAuth = (record: RouteRecord): boolean =>
  !!record.meta.requiresAuth;

const guard: NavigationGuard<Vue> = (to, from, next) => {
  console.log('router to: ', to);
  console.log('router from: ', from);
  if (to.matched.some(isRequiresAuth)) {
    // Already authenticated.
    const currentUser: firebase.User | null = store.getters['user/currentUser'];
    currentUser ? next() : next({ name: 'signin' });

    return;
  }
  next();
};

export default guard;