import { isMobile } from '@/util/userAgent';
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        path: '/sign-in',
        name: 'signIn',
        component: () => import('../views/SignIn.vue'),
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
        component: () => import('../views/web/Layout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('../views/web/Home.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/total-price',
                name: 'priceChart',
                component: () => import('../views/web/PriceChart.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate',
                name: 'coordinate',
                component: () => import('../views/web/coordinate/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate/new',
                name: 'coordinateNew',
                component: () => import('../views/web/coordinate/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/coordinate/:id',
                name: 'coordinateEdit',
                component: () => import('../views/web/coordinate/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand',
                name: 'brand',
                component: () => import('../views/web/brand/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/new',
                name: 'brandNew',
                component: () => import('../views/web/brand/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/:id',
                name: 'brandEdit',
                component: () => import('../views/web/brand/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre',
                name: 'genre',
                component: () => import('../views/web/genre/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/new',
                name: 'genreNew',
                component: () => import('../views/web/genre/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/:id',
                name: 'genreEdit',
                component: () => import('../views/web/genre/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop',
                name: 'shop',
                component: () => import('../views/web/shop/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/new',
                name: 'shopNew',
                component: () => import('../views/web/shop/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/:id',
                name: 'shopEdit',
                component: () => import('../views/web/shop/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes',
                name: 'clothes',
                component: () => import('../views/web/clothes/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/new',
                name: 'clothesNew',
                component: () => import('../views/web/clothes/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/:id',
                name: 'clothesEdit',
                component: () => import('../views/web/clothes/Edit.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/',
        component: () => import('../views/mobile/Layout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '/mobile/home',
                name: 'mobileHome',
                component: () => import('../views/mobile/Home.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/total-price',
                name: 'mobilePriceChart',
                component: () => import('../views/mobile/PriceChart.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/coordinate',
                name: 'mobileCoordinate',
                component: () => import('../views/mobile/coordinate/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/coordinate/show/:id',
                name: 'mobileCoordinateShow',
                component: () => import('../views/mobile/coordinate/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/coordinate/new',
                name: 'mobileCoordinateNew',
                component: () => import('../views/mobile/coordinate/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/coordinate/edit/:id',
                name: 'mobileCoordinateEdit',
                component: () => import('../views/mobile/coordinate/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/brand',
                name: 'mobileBrand',
                component: () => import('../views/mobile/brand/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/brand/show/:id',
                name: 'mobileBrandShow',
                component: () => import('../views/mobile/brand/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/brand/new',
                name: 'mobileBrandNew',
                component: () => import('../views/mobile/brand/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/brand/edit/:id',
                name: 'mobileBrandEdit',
                component: () => import('../views/mobile/brand/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/clothes',
                name: 'mobileClothes',
                component: () => import('../views/mobile/clothes/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/clothes/show/:id',
                name: 'mobileClothesShow',
                component: () => import('../views/mobile/clothes/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/clothes/new',
                name: 'mobileClothesNew',
                component: () => import('../views/mobile/clothes/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/clothes/edit/:id',
                name: 'mobileClothesEdit',
                component: () => import('../views/mobile/clothes/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/genre',
                name: 'mobileGenre',
                component: () => import('../views/mobile/genre/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/genre/show/:id',
                name: 'mobileGenreShow',
                component: () => import('../views/mobile/genre/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/genre/new',
                name: 'mobileGenreNew',
                component: () => import('../views/mobile/genre/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/genre/edit/:id',
                name: 'mobileGenreEdit',
                component: () => import('../views/mobile/genre/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/shop',
                name: 'mobileShop',
                component: () => import('../views/mobile/shop/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/shop/show/:id',
                name: 'mobileShopShow',
                component: () => import('../views/mobile/shop/Show.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/shop/new',
                name: 'mobileShopNew',
                component: () => import('../views/mobile/shop/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/mobile/maintenance/shop/edit/:id',
                name: 'mobileShopEdit',
                component: () => import('../views/mobile/shop/Edit.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '*',
        redirect: () => ({
            name: isMobile() ? 'mobileHome' : 'home'
        }),
        meta: { requiresAuth: true }
    }
];

export default routes;
