import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import store from './store';

import setAntdComponents from '@/plugins/antd/components';
import firebaseAuth from '@/plugins/firebase/auth';

setAntdComponents(Vue);
Vue.config.productionTip = false;

firebase.initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
});
firebaseAuth.init();

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
