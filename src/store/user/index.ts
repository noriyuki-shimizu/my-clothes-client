import { Getters, Mutations, Actions } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/user/type';

import api from '@/plugins/api';
import firebaseAuth from '@/plugins/firebase/auth';

const state: State = {
  id: null,
  user: null
};

const getters: Getters<State, IGetters> = {
  id(state) {
    return state.id;
  },
  currentUser(state) {
    return state.user;
  }
};

const mutations: Mutations<State, IMutations> = {
  onIdStateChange(state, payload) {
    state.id = payload;
  },
  onCurrentUserStateChanged(state, payload) {
    state.user = payload;
  }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
  async signinWithGithub(ctx) {
    const userCredential = await firebaseAuth.signInWithGithub();
    ctx.commit('onCurrentUserStateChanged', userCredential.user);
    await ctx.dispatch('linkUserToAPI');
  },
  async signinWithGoogle(ctx) {
    const userCredential = await firebaseAuth.signInWithGoogle();
    ctx.commit('onCurrentUserStateChanged', userCredential.user);
    await ctx.dispatch('linkUserToAPI');
  },
  async signinWithMailAddressAndPassword(ctx, payload) {
    const { mailAddress, password } = payload;
    const userCredential = await firebaseAuth.signInWithEmailAndPassword(
      mailAddress,
      password
    );
    ctx.commit('onCurrentUserStateChanged', userCredential.user);
    await ctx.dispatch('linkUserToAPI');
  },
  async linkUserToAPI(ctx) {
    const response = await api({
      method: 'POST',
      url: '/preLogin'
    });

    ctx.commit('onIdStateChange', response.data);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
