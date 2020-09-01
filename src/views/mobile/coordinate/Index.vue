<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'coordinateNew'
                    })
                "
            >
                {{ $t('operation.new') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.coordinate')} (${coordinates.length})`"
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

        <a-empty v-if="!coordinates.length" />
        <a-list
            v-else
            :grid="{ gutter: 5, column: 2 }"
            :data-source="coordinates"
        >
            <a-list-item slot="renderItem" slot-scope="coordinate">
                <a-card hoverable :title="$t(coordinate.season)">
                    <img
                        class="mc-item-image"
                        slot="cover"
                        alt="Coordinate image"
                        :src="
                            coordinate.imageLink ||
                                require('@/assets/image/no-img.png')
                        "
                        @click="
                            $router.push({
                                name: 'coordinateShow',
                                params: { id: coordinate.id }
                            })
                        "
                    />
                    <template slot="actions" class="ant-card-actions">
                        <a-popconfirm
                            :title="$t('message.confirm.delete')"
                            @confirm="() => onDelete(coordinate.id)"
                            :okText="$t('operation.yes')"
                            :cancelText="$t('operation.no')"
                        >
                            <a-icon type="delete" />
                            {{ $t('operation.item.delete') }}
                        </a-popconfirm>
                    </template>
                </a-card>
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
import { Coordinate } from '@/store/coordinate/type';

@Component
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message: AppMessage = resetMessage();

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        this.fetchCoordinates();
    }

    private async fetchCoordinates() {
        this.loading = true;
        await this.$store
            .dispatch('coordinate/fetchCoordinates')
            .catch(this.onError);
        this.loading = false;
    }

    get coordinates(): Coordinate[] {
        return this.$store.getters['coordinate/coordinates'];
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

    onDelete(id: Coordinate['id']) {
        this.loading = true;
        this.message = resetMessage();

        this.$store
            .dispatch('coordinate/onDeleteCoordinate', id)
            .catch(this.onError);

        this.loading = false;
    }
}
</script>

<style scoped>
.coordinate-item {
    width: 43vw;
}
</style>
