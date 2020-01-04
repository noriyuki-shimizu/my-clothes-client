export interface State {
    id: number | null;
    user: {
        uid: string;
        displayName: string | null;
        email: string | null;
        phoneNumber: string | null;
        photoURL: string | null;
    } | null;
    accessToken: string;
}

export interface IGetters {
    id: number | null;
    currentUser: State['user'] | null;
    accessToken: string;
}
export interface IRootGetters {
    'user/id': IGetters['id'];
    'user/currentUser': IGetters['currentUser'];
    'user/accessToken': IGetters['accessToken'];
}

export interface IMutations {
    onIdStateChanged: number | null;
    onCurrentUserStateChanged: State['user'] | null;
    onAccessTokenStateChanged: string;
}
export interface IRootMutations {
    'user/onIdStateChange': IMutations['onIdStateChanged'];
    'user/onCurrentUserStateChanged': IMutations['onCurrentUserStateChanged'];
    'user/onAccessTokenStateChanged': IMutations['onAccessTokenStateChanged'];
}

export interface IActions {
    onSaveUserStateFromExternal: firebase.User | null;
    signInWithGithub: void;
    signInWithGoogle: void;
    signInWithMailAddressAndPassword: {
        mailAddress: string;
        password: string;
    };
    linkUserToAPI: void;
    signOut: void;
    updateProfile: {
        displayName: string | null;
        iconFile: File | null;
    };
}
export interface IRootActions {
    'user/onSaveUserStateFromExternal': IActions['onSaveUserStateFromExternal'];
    'user/signInWithGithub': IActions['signInWithGithub'];
    'user/signInWithGoogle': IActions['signInWithGoogle'];
    'user/signInWithMailAddressAndPassword': IActions['signInWithMailAddressAndPassword'];
    'user/linkUserToAPI': IActions['linkUserToAPI'];
    'user/signOut': IActions['signOut'];
    'user/updateProfile': IActions['updateProfile'];
}
