import firebase from 'firebase/app';
import 'firebase/auth';

import {
    FirebaseExternalApiAuthError,
    FirebaseAuthError
} from '@/plugins/firebase/auth/type';

export const isFirebaseExternalApiAuthError = (
    err: any
): err is FirebaseExternalApiAuthError => {
    return 'credential' in err;
};

export const isFirebaseAuthError = (err: any): err is FirebaseAuthError => {
    return 'code' in err && 'message' in err;
};

export default {
    init(): void {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    },

    async createUserWithEmailAndPassword(
        name: string,
        mailAddress: string,
        password: string
    ): Promise<void> {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(mailAddress, password);

        const user = firebase.auth().currentUser as firebase.User;
        await user.updateProfile({
            displayName: name
        });
    },

    async signInWithEmailAndPassword(
        mailAddress: string,
        password: string
    ): Promise<firebase.auth.UserCredential> {
        return firebase
            .auth()
            .signInWithEmailAndPassword(mailAddress, password);
    },

    async signInWithGoogle(): Promise<firebase.auth.UserCredential> {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    },

    async signInWithGithub(): Promise<firebase.auth.UserCredential> {
        const provider = new firebase.auth.GithubAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    },

    async signOut(): Promise<void> {
        await firebase.auth().signOut();
    }
};
