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
    signinWithGithub: void;
    signinWithGoogle: void;
    signinWithMailAddressAndPassword: {
        mailAddress: string;
        password: string;
    };
    linkUserToAPI: void;
}
export interface IRootActions {
    'user/signinWithGithub': IActions['signinWithGithub'];
    'user/signinWithGoogle': IActions['signinWithGoogle'];
    'user/signinWithMailAddressAndPassword': IActions['signinWithMailAddressAndPassword'];
    'user/linkUserToAPI': IActions['linkUserToAPI'];
}
