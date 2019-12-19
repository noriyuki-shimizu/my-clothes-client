import 'vuex';
import * as Root from '@/store/type';
import * as Counter from '@/store/counter/type';
import * as User from '@/store/user/type';

declare module 'vuex' {
    type Getters<S, G> = {
        [K in keyof G]: (
            state: S,
            getters: G,
            rootState: RootState,
            rootGetters: RootGetters
        ) => G[K];
    };

    type Mutations<S, M> = {
        [K in keyof M]: (state: S, payload: M[K]) => void;
    };

    type ExCommit<M> = <T extends keyof M>(type: T, payload?: M[T]) => void;
    type ExDispatch<A> = <T extends keyof A>(type: T, payload?: A[T]) => any;
    type ExActionContext<S, A, G, M> = {
        commit: ExCommit<M>;
        dispatch: ExDispatch<A>;
        state: S;
        getters: G;
        rootState: RootState;
        rootGetters: RootGetters;
    };
    type Actions<S, A, G = {}, M = {}> = {
        [K in keyof A]: (
            ctx: ExActionContext<S, A, G, M>,
            payload: A[K]
        ) => any;
    };

    interface ExStore extends Store<RootState> {
        getters: RootGetters;
        commit: ExCommit<RootMutations>;
        dispatch: ExDispatch<RootActions>;
    }

    // -----------------------------------------------------------------------------

    type RootState = Root.State & {
        counter: Counter.State;
        user: User.State;
    };

    type RootGetters = Counter.IRootGetters & User.IRootGetters;

    type RootMutations = Counter.IRootMutations & User.IRootMutations;

    type RootActions = Counter.IRootActions & User.IRootActions;
}
