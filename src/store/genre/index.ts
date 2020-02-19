import { Getters, Mutations, Actions } from 'vuex';

import { State, IGetters, IMutations, IActions } from '@/store/genre/type';
import api from '@/plugins/api';

const state: State = {
    genres: [],
    totalPricePerGenres: [],
    canSelectedColors: []
};

const getters: Getters<State, IGetters> = {
    genres(state) {
        return state.genres;
    },
    totalPricePerGenres(state) {
        return state.totalPricePerGenres;
    },
    canSelectedColors(state) {
        return state.canSelectedColors;
    }
};

const mutations: Mutations<State, IMutations> = {
    allStateReset(state) {
        state.genres = [];
        state.totalPricePerGenres = [];
        state.canSelectedColors = [];
    },
    onGenresStateChange(state, payload) {
        state.genres = payload;
    },
    onTotalPricePerGenreStateChange(state, payload) {
        state.totalPricePerGenres = payload;
    },
    onCanSelectedColorsStateChange(state, payload) {
        state.canSelectedColors = payload;
    },
    onAddGenre(state, payload) {
        state.genres.push(payload);
    },
    onUpdateTargetGenre(state, payload) {
        state.genres = state.genres.map(genre =>
            genre.id === payload.id ? payload : genre
        );
    },
    onDeleteGenre(state, payload) {
        state.genres = state.genres.filter(genre => genre.id !== payload);
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchGenres(ctx) {
        const response = await api.get(`/${ctx.rootGetters['user/id']}/genres`);
        const { data } = response;

        ctx.commit('onGenresStateChange', data.genres);
    },
    async fetchTotalPricePerGenres(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/genres/clothes/total-price`
        );
        const { data } = response;

        ctx.commit('onTotalPricePerGenreStateChange', data.totalPricePerGenres);
    },
    async fetchCanSelectedColorsStateChange(ctx, id) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/genres/colors`,
            {
                params: {
                    id
                }
            }
        );
        const { data } = response;

        ctx.commit('onCanSelectedColorsStateChange', data.canSelectedColors);
    },
    async onAddGenre(ctx, { genre }) {
        const response = await api.post(
            `/${ctx.rootGetters['user/id']}/genres`,
            {
                ...genre
            }
        );

        ctx.commit('onAddGenre', response.data.genre);
    },
    async onUpdateGenre(ctx, { id, genre }) {
        const response = await api.put(
            `/${ctx.rootGetters['user/id']}/genres/${id}`,
            {
                ...genre
            }
        );

        ctx.commit('onUpdateTargetGenre', response.data.genre);
    },
    async onDeleteGenre(ctx, { id }) {
        await api.delete(`/${ctx.rootGetters['user/id']}/genres/${id}`);
        ctx.commit('onDeleteGenre', id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
