import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/Signin.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Signup.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../views/Common.vue'),
    meta: { requiresAuth: false },
    children: [
      { path: '*', redirect: { name: 'home' } },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
];

export default routes;
