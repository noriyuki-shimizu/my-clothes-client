import Vue from 'vue';
import initAntdComponents from '@/plugins/antd/components';
import initVueI18n from '@/plugins/i18n';
import firebaseApp from '@/plugins/firebase/app';
import firebaseAuth from '@/plugins/firebase/auth';
import sentry from '@/plugins/sentry';
import App from './App.vue';
import router from './router';
import store from './store';
import './css';
import './registerServiceWorker';

const i18n = initVueI18n(Vue);

initAntdComponents(Vue);
Vue.config.productionTip = false;

firebaseApp.init();
firebaseAuth.init();
sentry.init(Vue);

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
