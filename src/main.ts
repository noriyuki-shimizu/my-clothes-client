import Vue from 'vue';
import setAntdComponents from '@/plugins/antd/components';
import firebaseApp from '@/plugins/firebase/app';
import firebaseAuth from '@/plugins/firebase/auth';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/common.css';

setAntdComponents(Vue);
Vue.config.productionTip = false;

firebaseApp.init();
firebaseAuth.init();

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
