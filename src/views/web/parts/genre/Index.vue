<template>
    <div>
        <a-page-header title="Genre" subTitle="item list">
            <template slot="extra">
                <a-button
                    type="primary"
                    icon="reload"
                    key="2"
                    :loading="loading"
                    @click="reloadGenres"
                >
                    Reload list
                </a-button>
                <a-button
                    type="primary"
                    icon="file-add"
                    key="1"
                    @click="onNew"
                    :disabled="RegistrationNum > 20"
                >
                    New
                </a-button>
            </template>
        </a-page-header>
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <p>total item: {{ genres.length }}</p>
        <genre-table
            :genres="genres"
            :loading="loading"
            v-on:set-loading="setLoading"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import GenreTable from '@/components/genre/Table.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        GenreTable
    }
})
export default class Genre extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    loading = false;

    created() {
        if (!this.genres.length) {
            this.fetchGenres();
        }
    }

    reloadGenres() {
        this.$store.commit('genre/genresStateChange', []);
        this.fetchGenres();
    }

    private async fetchGenres() {
        this.loading = true;
        await this.$store
            .dispatch('genre/fetchGenres')
            .catch((err: any) => this.$emit('on-error', err));
        this.loading = false;
    }

    get genres() {
        return this.$store.getters['genre/genres'];
    }

    get RegistrationNum() {
        return this.$store.getters['genre/genres'].length;
    }

    @Emit('set-loading')
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    @Emit('on-error')
    onError(err: any) {
        this.message = resetMessage();
        handleForbiddenError(err, this.$store, this.$router);

        this.message = {
            isShow: true,
            text: `Error (${err.message})`,
            description: err.response
                ? err.response.data
                : `Access URL: ${err.config.url}`,
            type: 'error'
        };
    }

    onNew() {
        this.$router.push({ name: 'genreNew' });
    }
}
</script>
