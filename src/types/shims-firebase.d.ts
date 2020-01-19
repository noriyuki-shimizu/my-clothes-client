import 'firebase/app';

declare module 'firebase/app' {
    interface FirebaseStorageError extends FirebaseError {
        name: string;
        code: string;
        message: string;
        serverResponse: string; // JSON
    }

    interface FirebaseAuthError {
        code: string;
        message: string;
    }

    interface FirebaseExternalApiAuthError extends FirebaseAuthError {
        [k: string]: string | object;
        email: string;
        credential: {
            [k: string]: string | null;
        };
    }

    type ProfileState = Partial<
        Pick<firebase.User, 'displayName' | 'photoURL'>
    >;
}
