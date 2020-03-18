import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        path: '/sign-in/:again',
        name: 'signIn',
        component: () => import('../views/SignIn.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/sign-up',
        name: 'signUp',
        component: () => import('../views/SignUp.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: () => import('../views/ResetPassword.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/privacy-policy',
        name: 'privacyPolicy',
        component: () => import('../views/PrivacyPolicy.vue'),
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
                path: '/total-price',
                name: 'totalPrice',
                component: () => import('../views/TotalPrice.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate',
                name: 'coordinate',
                component: () => import('../views/coordinate/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate/new',
                name: 'coordinateNew',
                component: () => import('../views/coordinate/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate/:id',
                name: 'coordinateEdit',
                component: () => import('../views/coordinate/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand',
                name: 'brand',
                component: () => import('../views/parts/brand/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/new',
                name: 'brandNew',
                component: () => import('../views/parts/brand/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/:id',
                name: 'brandEdit',
                component: () => import('../views/parts/brand/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre',
                name: 'genre',
                component: () => import('../views/parts/genre/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/new',
                name: 'genreNew',
                component: () => import('../views/parts/genre/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/:id',
                name: 'genreEdit',
                component: () => import('../views/parts/genre/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop',
                name: 'shop',
                component: () => import('../views/parts/shop/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/new',
                name: 'shopNew',
                component: () => import('../views/parts/shop/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/:id',
                name: 'shopEdit',
                component: () => import('../views/parts/shop/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes',
                name: 'clothes',
                component: () => import('../views/parts/clothes/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/new',
                name: 'clothesNew',
                component: () => import('../views/parts/clothes/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/:id',
                name: 'clothesEdit',
                component: () => import('../views/parts/clothes/Edit.vue'),
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
