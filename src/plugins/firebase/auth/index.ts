import firebase from 'firebase/app';
import 'firebase/auth';

export default {
    init(): void {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    },

    async createUserWithEmailAndPassword(
        username: string,
        password: string
    ): Promise<firebase.auth.UserCredential> {
        return firebase
            .auth()
            .createUserWithEmailAndPassword(username, password);
    },

    async signInWithEmailAndPassword(
        username: string,
        password: string
    ): Promise<firebase.auth.UserCredential> {
        return firebase
            .auth()
            .signInWithEmailAndPassword(username, password);
    },

    async loginWithGoogle(): Promise<void> {
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
    },

    async loginWithGithub(): Promise<void> {
        const provider = new firebase.auth.GithubAuthProvider();
        await firebase.auth().signInWithPopup(provider);
    },

    async logout(): Promise<void> {
        return firebase.auth().signOut();
    },

    async onAuth(): Promise<void> {
        const user = firebase.auth().currentUser;

        const { authState, userStatus, token } = user
            ? {
                  authState: user,
                  userStatus: !!user.uid,
                  token: await user.getIdToken(true)
              }
            : {
                  authState: {} as firebase.User,
                  userStatus: false,
                  token: ''
              };

        console.info('login user : ', authState);

        /* 以下の処理は actions でやって */
        // store.commit(
        //     `${config.vuex.namespace.auths}/onAuthStateChanged`,
        //     authState
        // );
        // store.commit(
        //     `${config.vuex.namespace.auths}/onUserStatusChanged`,
        //     userStatus
        // );
        // store.commit(
        //     `${config.vuex.namespace.auths}/onTokenStateChanged`,
        //     token
        // );
    }
};
