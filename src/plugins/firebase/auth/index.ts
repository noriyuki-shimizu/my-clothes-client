import firebase, {
    FirebaseExternalApiAuthError,
    FirebaseAuthError,
    ProfileState
} from 'firebase/app';
import 'firebase/auth';

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

    async updateProfile({ displayName, photoURL }: ProfileState) {
        const user = firebase.auth().currentUser;
        if (user) {
            await user
                .updateProfile({
                    displayName,
                    photoURL
                })
                .catch(err => {
                    throw err;
                });
        }
        return firebase.auth().currentUser;
    },

    async signInWithGoogle(): Promise<firebase.auth.UserCredential> {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    },

    async signInWithTwitter(): Promise<firebase.auth.UserCredential> {
        const provider = new firebase.auth.TwitterAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    },

    async signInWithFacebook(): Promise<firebase.auth.UserCredential> {
        const provider = new firebase.auth.FacebookAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    },

    async signOut(): Promise<void> {
        await firebase.auth().signOut();
    }
};
