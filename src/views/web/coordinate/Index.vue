<template>
    <div>
        <a-page-header
            :title="`${$t('title.coordinate')} (${coordinates.length})`"
            :subTitle="$t('title.sub-title.item-list')"
        >
            <template slot="extra">
                <a-button
                    type="primary"
                    icon="reload"
                    key="2"
                    :loading="loading"
                    @click="reloadCoordinates"
                >
                    {{ $t('operation.reload-list') }}
                </a-button>
                <a-button
                    type="primary"
                    icon="file-add"
                    key="1"
                    @click="$router.push({ name: 'coordinateNew' })"
                >
                    {{ $t('operation.new') }}
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

        <a-tabs :defaultActiveKey="tabKey" @change="callback" type="card">
            <a-tab-pane
                :tab="$t('dictionary.season.spring')"
                key="dictionary.season.spring"
            >
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:show-coordinate="showCoordinate"
                    v-on:on-error="onError"
                />
            </a-tab-pane>
            <a-tab-pane
                :tab="$t('dictionary.season.summer')"
                key="dictionary.season.summer"
            >
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:show-coordinate="showCoordinate"
                    v-on:on-error="onError"
                />
            </a-tab-pane>
            <a-tab-pane
                :tab="$t('dictionary.season.autumn')"
                key="dictionary.season.autumn"
            >
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:show-coordinate="showCoordinate"
                    v-on:on-error="onError"
                />
            </a-tab-pane>
            <a-tab-pane
                :tab="$t('dictionary.season.winter')"
                key="dictionary.season.winter"
            >
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:show-coordinate="showCoordinate"
                    v-on:on-error="onError"
                />
            </a-tab-pane>
        </a-tabs>

        <coordinate-item-drawer
            :coordinateId="coordinateId"
            :coordinateItems="coordinateItems"
            :visible="visible"
            v-on:on-close="onClose"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import CoordinateList from '@/components/coordinate/List.vue';
import CoordinateItemDrawer from '@/components/clothes/Drawer.vue';
import { Coordinate } from '@/store/coordinate/type';
import { getSeason } from '@/util/date';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { ClothesItem } from '@/store/clothes/type';

@Component({
    components: {
        CoordinateList,
        CoordinateItemDrawer
    }
})
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    coordinateId: number | null = null;

    coordinateItems: ClothesItem[] = [];

    message: AppMessage = resetMessage();

    visible = false;

    loading = false;

    tabKey = getSeason(new Date());

    created() {
        this.fetchCoordinates();
    }

    reloadCoordinates() {
        this.$store.commit('coordinate/coordinatesStateChange', []);
        this.fetchCoordinates();
    }

    get coordinates() {
        return this.$store.getters['coordinate/coordinates'];
    }

    private async fetchCoordinates() {
        this.loading = true;
        await this.$store
            .dispatch('coordinate/fetchCoordinates')
            .catch(this.onError);
        this.loading = false;
    }

    @Emit('show-coordinate')
    showCoordinate({ id, usedCoordinates }: Coordinate) {
        this.coordinateId = id;
        this.coordinateItems = usedCoordinates;
        this.visible = true;
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

    @Emit('on-close')
    onClose() {
        this.visible = false;
    }

    callback(key: string) {
        this.tabKey = key;
    }
}
</script>
