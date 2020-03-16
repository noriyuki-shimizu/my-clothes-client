import { Getters, Mutations, Actions } from 'vuex';

import {
    State,
    IGetters,
    IMutations,
    IActions,
    Genre
} from '@/store/genre/type';
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
            color: payload.color
        };

        genres.splice(replaceIndex, 1, updateValue);
        state.genres = genres;
    },
    deleteGenre(state, payload) {
        state.genres = state.genres.filter(genre => genre.id !== payload);
    }
};

const actions: Actions<State, IActions, IGetters, IMutations> = {
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
        const { id, name, color } = updateValue;
        await api.put(`/${ctx.rootGetters['user/id']}/genres/${id}`, {
            name,
            color
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
