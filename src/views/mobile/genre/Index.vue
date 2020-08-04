<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'mobileGenreNew'
                    })
                "
            >
                {{ $t('operation.new') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.genre')} (${genres.length})`"
            :subTitle="$t('title.sub-title.item-list')"
        />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

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
                                name: 'mobileGenreShow',
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
                            {{ $t('operation.item.delete') }}
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

@Component
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

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

    get genres(): Genre[] {
        return this.$store.getters['genre/genres'];
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
