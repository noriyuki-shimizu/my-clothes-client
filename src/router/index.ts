import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from '@/router/routes';
import beforeEach from '@/router/before-each';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(beforeEach);

export default router;
