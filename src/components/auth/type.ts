export type SignInFormFields = {
    mailAddress: string;
    password: string;
};

export type SignUpFormFields = {
    name: string;
    mailAddress: string;
    password: string;
    confirm: string;
};

export interface HTMLElementEvent<T extends HTMLElement> extends Event {
    target: T;
}
