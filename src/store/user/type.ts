import { IModuleRootMutations } from '@/store/type';

export interface AppUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
}

export interface State {
    id: number | null;
    user: AppUser | null;
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

export interface IMutations extends IModuleRootMutations {
    onIdStateChanged: number | null;
    onCurrentUserStateChanged: firebase.User | null;
    onAccessTokenStateChanged: string;
}
export interface IRootMutations {
    'user/allStateReset': IMutations['allStateReset'];
    'user/onIdStateChange': IMutations['onIdStateChanged'];
    'user/onCurrentUserStateChanged': IMutations['onCurrentUserStateChanged'];
    'user/onAccessTokenStateChanged': IMutations['onAccessTokenStateChanged'];
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
    updateProfile: {
        displayName: string | null;
        iconFile: File | null;
    };
}
export interface IRootActions {
    'user/signInWithGithub': IActions['signInWithGithub'];
    'user/signInWithGoogle': IActions['signInWithGoogle'];
    'user/signInWithMailAddressAndPassword': IActions['signInWithMailAddressAndPassword'];
    'user/linkUserToAPI': IActions['linkUserToAPI'];
    'user/signOut': IActions['signOut'];
    'user/updateProfile': IActions['updateProfile'];
}
