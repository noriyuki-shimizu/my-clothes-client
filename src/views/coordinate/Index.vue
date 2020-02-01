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

        <a-tabs :defaultActiveKey="tabKey" @change="callback" type="card">
            <a-tab-pane tab="Spring" key="spring">
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:showCoordinate="showCoordinate"
                />
            </a-tab-pane>
            <a-tab-pane tab="Summer" key="summer">
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:showCoordinate="showCoordinate"
                />
            </a-tab-pane>
            <a-tab-pane tab="Autumn" key="autumn">
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:showCoordinate="showCoordinate"
                />
            </a-tab-pane>
            <a-tab-pane tab="Winter" key="winter">
                <coordinate-list
                    :tabKey="tabKey"
                    v-on:showCoordinate="showCoordinate"
                />
            </a-tab-pane>
        </a-tabs>

        <a-drawer
            title="Coordinate item"
            placement="bottom"
            height="600"
            :closable="false"
            @close="onClose"
            :visible="visible"
            :wrapStyle="{
                height: '95%',
                overflow: 'auto'
            }"
        >
            <a-list
                :grid="{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3
                }"
                :dataSource="coordinateItems"
            >
                <a-list-item slot="renderItem" slot-scope="item">
                    <a-card hoverable style="width: 220px">
                        <img
                            class="coordinate-item-image"
                            :src="item.imageLink"
                            slot="cover"
                        />
                        <a-card-meta>
                            <template slot="description">
                                <div>Brand ... {{ item.brandName }}</div>
                                <div>Shop ... {{ item.shopName }}</div>
                                <div>
                                    Price ... {{ item.price.toLocaleString() }}
                                </div>
                                <div>
                                    Genre ...
                                    <a-tag
                                        v-for="(genre, index) in item.genres"
                                        :key="index"
                                        :color="genre.color"
                                    >
                                        {{ genre.name }}
                                    </a-tag>
                                </div>
                                <div>Buy date ... {{ item.buyDate }}</div>
                                <div>
                                    <a-rate
                                        :defaultValue="item.satisfaction"
                                        disabled
                                    />
                                </div>
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-list-item>
            </a-list>
            <div id="update-coordinate-button">
                <a-button
                    type="primary"
                    icon="edit"
                    @click="
                        $router.push({
                            name: 'coordinateEdit',
                            params: { id: selectedCoordinateId }
                        })
                    "
                >
                    Edit
                </a-button>
            </div>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import CoordinateList from '@/components/coordinate/List.vue';
import { CoordinateItem, Coordinate } from '@/store/coordinate/type';
import { getSeason } from '@/util/date';
import { resetMessage } from '@/util/reset';
import { isAxiosError } from '@/plugins/api';

@Component({
    components: {
        CoordinateList
    }
})
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    selectedCoordinateId?: number;

    selectedCoordinateItem: CoordinateItem[] = [];

    message: AppMessage = resetMessage();

    visible = false;

    tabKey = getSeason(new Date());

    async created() {
        await this.$store
            .dispatch('coordinate/fetchCoordinates')
            .catch(this.onError);
    }

    get dataSource() {
        const coordinates = this.$store.getters['coordinate/coordinates'];
        return coordinates.filter(
            coordinate => coordinate.season === this.tabKey
        );
    }

    get coordinateItems() {
        return this.selectedCoordinateItem;
    }

    @Emit('showCoordinate')
    showCoordinate({ id, usedCoordinates }: Coordinate) {
        this.selectedCoordinateId = id;
        this.selectedCoordinateItem = usedCoordinates;
        this.visible = true;
    }

    onError(err: any) {
        this.message = resetMessage();
        if (isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                const { $store, $router } = this;
                this.$warning({
                    title: 'Certification expired',
                    content: 'Please sign in again.',
                    onOk: () => {
                        $store.dispatch('user/signOut');
                        $router.push({
                            name: 'signIn',
                            params: { again: 'again' }
                        });
                    }
                });
                return;
            }

            this.message = {
                isShow: true,
                text: `Error (${err.message})`,
                description: err.response
                    ? err.response.data
                    : `Access URL: ${err.config.url}`,
                type: 'error'
            };
        }
    }

    onClose() {
        this.visible = false;
    }

    callback(key: string) {
        this.tabKey = key;
    }
}
</script>

<style scoped>
.coordinate-item-image {
    height: 250px;
    width: 220;
}

#operation_field {
    position: absolute;
    right: 50px;
    width: 100%;
    text-align: right;
}

#update-coordinate-button {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
}

.alert-message {
    margin-bottom: 20px;
}
</style>
