export interface FirebaseAuthError {
    code: string;
    message: string;
}

export interface FirebaseExternalApiAuthError extends FirebaseAuthError {
    [k: string]: string | object;
    email: string;
    credential: {
        [k: string]: string | null;
    };
}
