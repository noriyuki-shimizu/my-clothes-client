import api from '@/plugins/api';
import firebaseAuth from '@/plugins/firebase/auth';
import firebaseStorage from '@/plugins/firebase/storage';
import {
    IActions,
    IGetters,
    IMutations,
    State,
    TYPES,
    AppUser
} from '@/store/user/type';
import { Actions, Getters, Mutations } from 'vuex';
import * as Cookie from 'js-cookie';

const getters: Getters<State, IGetters> = {
    id() {
        const id = Cookie.get(TYPES.USER_ID);
        if (id) {
            return Number(id);
        }
        return null;
    },
    currentUser() {
        const user = Cookie.getJSON(TYPES.USER_DETAIL);
        if (user) {
            return user as AppUser;
        }
        return null;
    },
    accessToken() {
        const accessToken = Cookie.get(TYPES.ACCESS_TOKEN);
        if (accessToken) {
            return accessToken;
        }
        return '';
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset() {
        Cookie.remove(TYPES.USER_ID);
        Cookie.remove(TYPES.USER_DETAIL);
        Cookie.remove(TYPES.ACCESS_TOKEN);
    },
    idStateChanged(_, payload) {
        if (payload) {
            Cookie.set(TYPES.USER_ID, String(payload), { expires: 1 / 2 });
        }
    },
    currentUserStateChanged(_, payload) {
        if (payload) {
            const { uid, displayName, email, phoneNumber, photoURL } = payload;

            Cookie.set(
                TYPES.USER_DETAIL,
                {
                    uid,
                    displayName,
                    email,
                    phoneNumber,
                    photoURL
                },
                { expires: 1 / 2 }
            );
        }
    },
    accessTokenStateChanged(_, payload) {
        if (payload) {
            Cookie.set(TYPES.ACCESS_TOKEN, payload, { expires: 1 / 2 });
        }
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
        const response = await api.post<number>('/users/authentication', {
            userAgent: navigator.userAgent
        });
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
    state: {},
    getters,
    mutations,
    actions
};
