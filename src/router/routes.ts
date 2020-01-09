import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        path: '/signIn',
        name: 'signIn',
        component: () => import('../views/SignIn.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/signUp',
        name: 'signUp',
        component: () => import('../views/SignUp.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: () => import('../views/Layout.vue'),
        meta: { requiresAuth: false },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('../views/Home.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand',
                name: 'brand',
                component: () => import('../views/maintenance/brand/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/new',
                name: 'brandNew',
                component: () => import('../views/maintenance/brand/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/:id',
                name: 'brandEdit',
                component: () => import('../views/maintenance/brand/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '*',
                redirect: { name: 'home' },
                meta: { requiresAuth: true }
            }
        ]
    }
];

export default routes;
