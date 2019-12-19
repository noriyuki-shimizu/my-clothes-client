import Vue from 'vue';
import Vuex from 'vuex';
import counter from '@/store/counter';
import user from '@/store/user';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        counter,
        user
    }
});
