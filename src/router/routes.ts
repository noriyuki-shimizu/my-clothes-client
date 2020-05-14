import { RouteConfig } from 'vue-router';
import { Route } from 'ant-design-vue/types/breadcrumb/breadcrumb';
import { isMobile } from '@/util/userAgent';

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
        meta: { requiresAuth: false },
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
                component: () => import('../views/web/parts/brand/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/new',
                name: 'brandNew',
                component: () => import('../views/web/parts/brand/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/brand/:id',
                name: 'brandEdit',
                component: () => import('../views/web/parts/brand/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre',
                name: 'genre',
                component: () => import('../views/web/parts/genre/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/new',
                name: 'genreNew',
                component: () => import('../views/web/parts/genre/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/genre/:id',
                name: 'genreEdit',
                component: () => import('../views/web/parts/genre/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop',
                name: 'shop',
                component: () => import('../views/web/parts/shop/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/new',
                name: 'shopNew',
                component: () => import('../views/web/parts/shop/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/shop/:id',
                name: 'shopEdit',
                component: () => import('../views/web/parts/shop/Edit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes',
                name: 'clothes',
                component: () => import('../views/web/parts/clothes/Index.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/new',
                name: 'clothesNew',
                component: () => import('../views/web/parts/clothes/New.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/maintenance/clothes/:id',
                name: 'clothesEdit',
                component: () => import('../views/web/parts/clothes/Edit.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/',
        component: () => import('../views/mobile/Layout.vue'),
        meta: { requiresAuth: false },
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
            }
        ]
    }
    // TODO モバイルの実装が完了したら、コメントアウトを戻すこと
    // {
    //     path: '*',
    //     redirect: () => ({
    //         name: isMobile(navigator.userAgent) ? 'mobileHome' : 'home'
    //     }),
    //     meta: { requiresAuth: true }
    // }
];

export default routes;
