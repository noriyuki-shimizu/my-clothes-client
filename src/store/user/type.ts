export interface State {
    id: number | null;
    user: firebase.User | null;
}

export interface IGetters {
    id: number | null;
    currentUser: firebase.User | null;
}
export interface IRootGetters {
    'user/id': IGetters['id'];
    'user/currentUser': IGetters['currentUser'];
}

export interface IMutations {
    onIdStateChange: number;
    onCurrentUserStateChanged: firebase.User | null;
}
export interface IRootMutations {
    'user/onIdStateChange': IMutations['onIdStateChange'];
    'user/onCurrentUserStateChanged': IMutations['onCurrentUserStateChanged'];
}

export interface IActions {
    signInWithGithub: void;
    signInWithGoogle: void;
    signInWithMailAddressAndPassword: {
        mailAddress: string;
        password: string;
    };
    linkUserToAPI: void;
    signOut: void;
}
export interface IRootActions {
    'user/signInWithGithub': IActions['signInWithGithub'];
    'user/signInWithGoogle': IActions['signInWithGoogle'];
    'user/signInWithMailAddressAndPassword': IActions['signInWithMailAddressAndPassword'];
    'user/linkUserToAPI': IActions['linkUserToAPI'];
    'user/signOut': IActions['signOut'];
}
