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
