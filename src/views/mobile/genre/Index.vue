<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-affix :offset-top="100">
                <a-button
                    type="primary"
                    @click="
                        $router.push({
                            name: 'genreNew'
                        })
                    "
                >
                    {{ $t('operation.new') }}
                </a-button>
            </a-affix>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.genre')} (${genres.length})`"
            :subTitle="$t('title.sub-title.item-list')"
        />
        <a-divider class="mc-pipe" />

        <a-alert
            class="mc-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <a-collapse class="mc-refine-container">
            <a-collapse-panel :header="$t('operation.refine')">
                <a-form layout="vertical">
                    <a-form-item :label="$t('dictionary.genre.name')">
                        <a-auto-complete
                            v-model="filteringGenreName"
                            @change="onChangeFilteringGenreName"
                        >
                            <template slot="dataSource">
                                <a-select-option
                                    v-for="name in filteringGenreNames"
                                    :key="name"
                                >
                                    {{ name }}
                                </a-select-option>
                            </template>
                        </a-auto-complete>
                    </a-form-item>
                    <div class="mc-operation-reset">
                        <a @click="resetFiltering">{{
                            $t('operation.reset')
                        }}</a>
                    </div>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-empty v-if="!genres.length" />
        <a-list v-else :data-source="genres">
            <a-list-item
                class="genres-list-item"
                slot="renderItem"
                slot-scope="item"
            >
                <div class="detail">
                    <a-tag
                        :color="item.color"
                        @click="
                            $router.push({
                                name: 'genreShow',
                                params: { id: item.id }
                            })
                        "
                    >
                        {{ item.name }}
                    </a-tag>
                    <a>
                        <a-popconfirm
                            :title="$t('message.confirm.delete')"
                            placement="topRight"
                            @confirm="() => onDelete(item.id)"
                            :okText="$t('operation.yes')"
                            :cancelText="$t('operation.no')"
                        >
                            <a-icon type="delete" />
                        </a-popconfirm>
                    </a>
                </div>
            </a-list-item>
        </a-list>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Genre } from '@/store/genre/type';
import { textIncludes } from '@/util/text';

@Component
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

    filteringGenreName: string = '';

    filteringGenreNames: string[] = [];

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        this.fetchGenres();
    }

    private async fetchGenres() {
        this.loading = true;

        this.setMessage();
        await this.$store.dispatch('genre/fetchGenres').catch(this.onError);

        this.loading = false;
    }

    resetFiltering() {
        this.filteringGenreName = '';
    }

    get genres(): Genre[] {
        const genres = this.$store.getters['genre/genres'];
        const trimValue = this.filteringGenreName.trim();

        if (trimValue) {
            return genres.filter((genre) =>
                textIncludes(genre.name, trimValue)
            );
        }
        return genres;
    }

    onChangeFilteringGenreName(value: string) {
        const genres = this.$store.getters['genre/genres'];
        const genreNames = genres.map((genre) => genre.name);
        const trimValue = value.trim();
        if (trimValue) {
            this.filteringGenreNames = genreNames.filter((name) =>
                textIncludes(name, trimValue)
            );
            return;
        }
        this.filteringGenreNames = [];
    }

    async onDelete(id: number) {
        this.loading = true;

        this.setMessage();
        await this.$store
            .dispatch('genre/onDeleteGenre', id)
            .catch(this.onError);

        this.loading = false;
    }

    @Emit('set-message')
    setMessage(message?: AppMessage) {
        this.message = message || resetMessage();
    }

    @Emit('on-error')
    onError(err: any) {
        this.message = resetMessage();
        handleForbiddenError(err, this.$store, this.$router);

        const { data } = err.response;
        this.message = {
            isShow: true,
            text: this.$t('status.error').toString(),
            description: this.$t(data).toString(),
            type: 'error'
        };
    }
}
</script>

<style scoped>
.genres-list-item {
    padding: 13px;
}

.detail {
    margin-left: 15px;
}

.detail a {
    position: absolute;
    right: 30px;
}
</style>
