import { isMobile } from '@/util/userAgent';
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        path: '/sign-in',
        name: 'signIn',
        component: () => {
            if (isMobile()) {
                return import('../views/mobile/SignIn.vue');
            }
            return import('../views/web/SignIn.vue');
        },
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
        component: () => {
            if (isMobile()) {
                return import('../views/mobile/Layout.vue');
            }
            return import('../views/web/Layout.vue');
        },
        redirect: () => ({
            name: 'home'
        }),
        meta: { requiresAuth: true },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/Home.vue');
                    }
                    return import('../views/web/Home.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/total-price',
                name: 'priceChart',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/PriceChart.vue');
                    }
                    return import('../views/web/PriceChart.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate',
                name: 'coordinate',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/coordinate/Index.vue');
                    }
                    return import('../views/web/coordinate/Index.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate/new',
                name: 'coordinateNew',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/coordinate/New.vue');
                    }
                    return import('../views/web/coordinate/New.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate/show/:id',
                name: 'coordinateShow',
                component: () => import('../views/mobile/coordinate/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate/:id',
                name: 'coordinateEdit',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/coordinate/Edit.vue');
                    }
                    return import('../views/web/coordinate/Edit.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand',
                name: 'brand',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/brand/Index.vue');
                    }
                    return import('../views/web/brand/Index.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/new',
                name: 'brandNew',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/brand/New.vue');
                    }
                    return import('../views/web/brand/New.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/show/:id',
                name: 'brandShow',
                component: () => import('../views/mobile/brand/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/:id',
                name: 'brandEdit',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/brand/Edit.vue');
                    }
                    return import('../views/web/brand/Edit.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre',
                name: 'genre',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/genre/Index.vue');
                    }
                    return import('../views/web/genre/Index.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/new',
                name: 'genreNew',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/genre/New.vue');
                    }
                    return import('../views/web/genre/New.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/show/:id',
                name: 'genreShow',
                component: () => import('../views/mobile/genre/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/:id',
                name: 'genreEdit',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/genre/Edit.vue');
                    }
                    return import('../views/web/genre/Edit.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop',
                name: 'shop',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/shop/Index.vue');
                    }
                    return import('../views/web/shop/Index.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/new',
                name: 'shopNew',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/shop/New.vue');
                    }
                    return import('../views/web/shop/New.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/show/:id',
                name: 'shopShow',
                component: () => import('../views/mobile/shop/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/:id',
                name: 'shopEdit',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/shop/Edit.vue');
                    }
                    return import('../views/web/shop/Edit.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes',
                name: 'clothes',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/clothes/Index.vue');
                    }
                    return import('../views/web/clothes/Index.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/new',
                name: 'clothesNew',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/clothes/New.vue');
                    }
                    return import('../views/web/clothes/New.vue');
                },
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/show/:id',
                name: 'clothesShow',
                component: () => import('../views/mobile/clothes/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/:id',
                name: 'clothesEdit',
                component: () => {
                    if (isMobile()) {
                        return import('../views/mobile/clothes/Edit.vue');
                    }
                    return import('../views/web/clothes/Edit.vue');
                },
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '*',
        redirect: () => ({
            name: 'home'
        }),
        meta: { requiresAuth: true }
    }
];

export default routes;
