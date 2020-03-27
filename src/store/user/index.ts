import { Getters, Mutations, Actions, ExActionContext } from 'vuex';
import { State, IGetters, IMutations, IActions } from '@/store/user/type';

import api from '@/plugins/api';
import firebaseAuth from '@/plugins/firebase/auth';
import firebaseStorage from '@/plugins/firebase/storage';

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
    allStateReset(state) {
        state.id = null;
        state.user = null;
        state.accessToken = '';
    },
    idStateChanged(state, payload) {
        state.id = payload;
    },
    currentUserStateChanged(state, payload) {
        state.user = payload;
        if (payload) {
            const { uid, displayName, email, phoneNumber, photoURL } = payload;
            state.user = {
                uid,
                displayName,
                email,
                phoneNumber,
                photoURL
            };
            return;
        }
        state.user = null;
    },
    accessTokenStateChanged(state, payload) {
        state.accessToken = payload;
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async signInWithGoogle(ctx) {
        const userCredential = await firebaseAuth.signInWithGoogle();
        const user = userCredential.user as firebase.User;

        ctx.commit('accessTokenStateChanged', await user.getIdToken(true));
        await ctx.dispatch('linkUserToAPI');
        await ctx.commit('currentUserStateChanged', user);
    },
    async signInWithTwitter(ctx) {
        const userCredential = await firebaseAuth.signInWithTwitter();
        const user = userCredential.user as firebase.User;

        ctx.commit('accessTokenStateChanged', await user.getIdToken(true));
        await ctx.dispatch('linkUserToAPI');
        await ctx.commit('currentUserStateChanged', user);
    },
    async signInWithFacebook(ctx) {
        const userCredential = await firebaseAuth.signInWithFacebook();
        const user = userCredential.user as firebase.User;

        ctx.commit('accessTokenStateChanged', await user.getIdToken(true));
        await ctx.dispatch('linkUserToAPI');
        await ctx.commit('currentUserStateChanged', user);
    },
    async linkUserToAPI(ctx) {
        const response = await api.post('/preLogin');
        ctx.commit('idStateChanged', response.data);
    },
    async signOut(ctx) {
        await firebaseAuth.signOut();
        ctx.commit('allStateReset');
    },
    async updateProfile(ctx, { displayName, iconFile }) {
        const user = ctx.getters['currentUser'] as firebase.User;

        if (
            user.photoURL &&
            iconFile &&
            // TODO: ここのハードコードをいずれなんとかすること
            user.photoURL.indexOf('https://firebasestorage.googleapis.com') > -1
        ) {
            await firebaseStorage.image.deleteImageByFullPath(user.photoURL);
        }

        const photoURL = iconFile
            ? await firebaseStorage.image.upload(iconFile, user.uid, 'me')
            : user.photoURL;

        const updatedUser = await firebaseAuth.updateProfile({
            displayName,
            photoURL
        });
        ctx.commit('currentUserStateChanged', updatedUser);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
