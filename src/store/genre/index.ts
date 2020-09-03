import { Getters, Mutations, Actions } from 'vuex';

import {
    State,
    IGetters,
    IMutations,
    IActions,
    Genre
} from '@/store/genre/type';
import api from '@/plugins/api';

const initGenre = (): Genre => ({
    id: 0,
    name: '',
    color: '',
    description: ''
});

const state: State = {
    genre: initGenre(),
    genres: [],
    totalPricePerGenres: [],
    canSelectedColors: []
};

const getters: Getters<State, IGetters> = {
    genre(state) {
        return state.genre;
    },
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
    resetGenre(state) {
        state.genre = initGenre();
    },
    genreStateChange(state, payload) {
        state.genre = payload;
    },
    genresStateChange(state, payload) {
        state.genres = payload;
    },
    totalPricePerGenreStateChange(state, payload) {
        state.totalPricePerGenres = payload;
    },
    canSelectedColorsStateChange(state, payload) {
        state.canSelectedColors = payload;
    },
    addGenre(state, payload) {
        state.genres.push(payload);
    },
    updateTargetGenre(state, payload) {
        const { genres } = state;
        const replaceIndex = genres.map(genre => genre.id).indexOf(payload.id);

        const updateValue = {
            ...genres[replaceIndex],
            name: payload.name,
            color: payload.color,
            description: payload.description
        };

        genres.splice(replaceIndex, 1, updateValue);
        state.genres = genres;
    },
    deleteGenre(state, payload) {
        state.genres = state.genres.filter(genre => genre.id !== payload);
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
    async fetchGenre(ctx, id) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/genres/${id}`
        );
        const { data } = response;

        ctx.commit('genreStateChange', data.genre);
    },
    async fetchGenres(ctx) {
        const response = await api.get(`/${ctx.rootGetters['user/id']}/genres`);
        const { data } = response;

        ctx.commit('genresStateChange', data.genres);
    },
    async fetchTotalPricePerGenres(ctx) {
        const response = await api.get(
            `/${ctx.rootGetters['user/id']}/genres/clothes/total-price`
        );
        const { data } = response;

        ctx.commit('totalPricePerGenreStateChange', data.totalPricePerGenres);
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

        ctx.commit('canSelectedColorsStateChange', data.canSelectedColors);
    },
    async onAddGenre(ctx, formFields) {
        const response = await api.post<{ genre: Genre }>(
            `/${ctx.rootGetters['user/id']}/genres`,
            formFields
        );

        ctx.commit('addGenre', response.data.genre);
    },
    async onUpdateGenre(ctx, updateValue) {
        const { id, name, color, description } = updateValue;
        await api.put(`/${ctx.rootGetters['user/id']}/genres/${id}`, {
            name,
            color,
            description
        });

        ctx.commit('updateTargetGenre', updateValue);
    },
    async onDeleteGenre(ctx, id) {
        await api.delete(`/${ctx.rootGetters['user/id']}/genres/${id}`);
        ctx.commit('deleteGenre', id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
