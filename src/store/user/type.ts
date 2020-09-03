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
    currentUser: AppUser | null;
    accessToken: string;
}
export interface IRootGetters {
    'user/id': IGetters['id'];
    'user/currentUser': IGetters['currentUser'];
    'user/accessToken': IGetters['accessToken'];
}

export interface IMutations extends IModuleRootMutations {
    idStateChanged: number | null;
    currentUserStateChanged: firebase.User | null;
    accessTokenStateChanged: string;
}
export interface IRootMutations {
    'user/allStateReset': IMutations['allStateReset'];
    'user/idStateChanged': IMutations['idStateChanged'];
    'user/currentUserStateChanged': IMutations['currentUserStateChanged'];
    'user/accessTokenStateChanged': IMutations['accessTokenStateChanged'];
}

export interface IActions {
    signInWithGoogle: void;
    signInWithTwitter: void;
    signInWithFacebook: void;
    linkUserToAPI: void;
    signOut: void;
    updateProfile: {
        displayName: string | null;
        iconFile: File | null;
    };
}
export interface IRootActions {
    'user/signInWithGoogle': IActions['signInWithGoogle'];
    'user/signInWithTwitter': IActions['signInWithTwitter'];
    'user/signInWithFacebook': IActions['signInWithFacebook'];
    'user/linkUserToAPI': IActions['linkUserToAPI'];
    'user/signOut': IActions['signOut'];
    'user/updateProfile': IActions['updateProfile'];
}
