import 'vuex';
import * as Root from '@/store/type';
import * as User from '@/store/user/type';
import * as Brand from '@/store/brand/type';
import * as Genre from '@/store/genre/type';
import * as Shop from '@/store/shop/type';
import * as Clothes from '@/store/clothes/type';
import * as Coordinate from '@/store/coordinate/type';

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
        user: User.State;
        brand: Brand.State;
        genre: Genre.State;
        shop: Shop.State;
        clothes: Clothes.State;
        coordinate: Coordinate.State;
    };

    type RootGetters = User.IRootGetters &
        Brand.IRootGetters &
        Genre.IRootGetters &
        Shop.IRootGetters &
        Clothes.IRootGetters &
        Coordinate.IRootGetters;

    type RootMutations = User.IRootMutations &
        Brand.IRootMutations &
        Genre.IRootMutations &
        Shop.IRootMutations &
        Clothes.IRootMutations &
        Coordinate.IRootMutations;

    type RootActions = User.IRootActions &
        Brand.IRootActions &
        Genre.IRootActions &
        Shop.IRootActions &
        Clothes.IRootActions &
        Coordinate.IRootActions;
}
