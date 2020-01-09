import { Getters, Mutations, Actions, ExActionContext } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/user/type';

import api from '@/plugins/api';
import firebaseAuth from '@/plugins/firebase/auth';
import firebaseImageStorage from '@/plugins/firebase/storage/image';

const state: State = {
    id: null,
    user: null,
    accessToken: ''
};

const getters: Getters<State, IGetters> = {
    id(state) {
        return state.id;
    },
    currentUser(state) {
        return state.user;
    },
    accessToken(state) {
        return state.accessToken;
    }
};

const mutations: Mutations<State, IMutations> = {
    onIdStateChanged(state, payload) {
        state.id = payload;
    },
    onCurrentUserStateChanged(state, payload) {
        state.user = payload;
    },
    onAccessTokenStateChanged(state, payload) {
        state.accessToken = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async onSaveUserStateFromExternal(ctx, user: firebase.User | null) {
        if (user) {
            const { uid, displayName, email, phoneNumber, photoURL } = user;
            ctx.commit('onCurrentUserStateChanged', {
                uid,
                displayName,
                email,
                phoneNumber,
                photoURL
            });
            return;
        }
        ctx.commit('onCurrentUserStateChanged', null);
    },
    async signInWithGithub(ctx) {
        const userCredential: firebase.auth.UserCredential = await firebaseAuth.signInWithGithub();
        const user = userCredential.user as firebase.User;

        ctx.commit('onAccessTokenStateChanged', await user.getIdToken(true));
        await ctx.dispatch('onSaveUserStateFromExternal', user);
        await ctx.dispatch('linkUserToAPI');
    },
    async signInWithGoogle(ctx) {
        const userCredential = await firebaseAuth.signInWithGoogle();
        const user = userCredential.user as firebase.User;

        ctx.commit('onAccessTokenStateChanged', await user.getIdToken(true));
        await ctx.dispatch('onSaveUserStateFromExternal', user);
        await ctx.dispatch('linkUserToAPI');
    },
    async signInWithMailAddressAndPassword(ctx, { mailAddress, password }) {
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(
            mailAddress,
            password
        );
        const user = userCredential.user as firebase.User;

        ctx.commit('onAccessTokenStateChanged', await user.getIdToken(true));
        await ctx.dispatch('onSaveUserStateFromExternal', user);
        await ctx.dispatch('linkUserToAPI');
    },
    async linkUserToAPI(ctx) {
        const response = await api.post('/preLogin');
        ctx.commit('onIdStateChanged', response.data);
    },
    async signOut(ctx) {
        await firebaseAuth.signOut();
        ctx.commit('onIdStateChanged', null);
        ctx.commit('onCurrentUserStateChanged', null);
        ctx.commit('onAccessTokenStateChanged', '');
    },
    async updateProfile(ctx, { displayName, iconFile }) {
        const user = ctx.getters['currentUser'] as firebase.User;

        if (user.photoURL && iconFile) {
            await firebaseImageStorage.deleteImageByFullPath(user.photoURL);
        }

        const photoURL = iconFile
            ? await firebaseImageStorage.upload(iconFile, 'user/')
            : user.photoURL;

        const updatedUser = await firebaseAuth.updateProfile({
            displayName,
            photoURL
        });
        ctx.commit('onCurrentUserStateChanged', updatedUser);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
