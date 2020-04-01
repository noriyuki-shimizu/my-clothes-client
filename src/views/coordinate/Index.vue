<template>
    <div>
        <div id="operation_field">
            <a-button
                type="primary"
                icon="edit"
                size="large"
                @click="$router.push({ name: 'coordinateNew' })"
            >
                New
            </a-button>
        </div>

        <h1>Coordinate</h1>
        <a-divider />

        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <a-tooltip>
            <template slot="title">
                List reload
            </template>
            <a-button
                class="reload-button"
                type="primary"
                shape="circle"
                icon="reload"
                size="small"
                @click="fetchCoordinates"
                :loading="loading"
            ></a-button>
        </a-tooltip>

        <a-tabs :defaultActiveKey="tabKey" @change="callback" type="card">
            <a-tab-pane tab="Spring" key="spring">
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:show-coordinate="showCoordinate"
                    v-on:on-error="onError"
                />
            </a-tab-pane>
            <a-tab-pane tab="Summer" key="summer">
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:show-coordinate="showCoordinate"
                    v-on:on-error="onError"
                />
            </a-tab-pane>
            <a-tab-pane tab="Autumn" key="autumn">
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:show-coordinate="showCoordinate"
                    v-on:on-error="onError"
                />
            </a-tab-pane>
            <a-tab-pane tab="Winter" key="winter">
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
import { CoordinateItem, Coordinate } from '@/store/coordinate/type';
import { getSeason } from '@/util/date';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        CoordinateList,
        CoordinateItemDrawer
    }
})
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    coordinateId: number | null = null;

    coordinateItems: CoordinateItem[] = [];

    message: AppMessage = resetMessage();

    visible = false;

    loading = false;

    tabKey = getSeason(new Date());

    created() {
        this.fetchCoordinates();
    }

    async fetchCoordinates() {
        this.loading = true;
        await this.$store
            .dispatch('coordinate/fetchCoordinates')
            .catch(this.onError);
        this.loading = false;
    }

    get dataSource() {
        const coordinates = this.$store.getters['coordinate/coordinates'];
        return coordinates.filter(
            coordinate => coordinate.season === this.tabKey
        );
    }

    @Emit('show-coordinate')
    showCoordinate({ id, usedCoordinates }: Required<Coordinate>) {
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

<style scoped>
#operation_field {
    position: absolute;
    right: 50px;
    width: 100%;
    text-align: right;
}

.alert-message {
    margin-bottom: 20px;
}

.reload-button {
    margin-left: 15px;
    margin-bottom: 15px;
}
</style>
