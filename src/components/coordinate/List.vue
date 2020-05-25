<template>
    <div>
        <a-empty class="coordinate-empty" v-if="!dataSource.length" />
        <a-list
            v-else
            :grid="{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 6
            }"
            :dataSource="dataSource"
        >
            <a-list-item slot="renderItem" slot-scope="item">
                <a-card hoverable style="width: 240px">
                    <img
                        class="coordinate-image"
                        :src="item.imageLink"
                        slot="cover"
                    />
                    <a-card-meta>
                        <template slot="description">
                            <div class="operation-button">
                                <a-button
                                    type="primary"
                                    icon="search"
                                    ghost
                                    :style="{
                                        marginRight: '8px'
                                    }"
                                    @click="
                                        () => $emit('show-coordinate', item)
                                    "
                                />
                                <a-popconfirm
                                    placement="topRight"
                                    title="Are you sure delete this coodinate?"
                                    @confirm="() => confirm(item.id)"
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <a-button
                                        type="danger"
                                        icon="delete"
                                        ghost
                                    />
                                </a-popconfirm>
                            </div>
                        </template>
                    </a-card-meta>
                </a-card>
            </a-list-item>
        </a-list>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';

@Component
export default class CoordinateList extends Vue {
    @Prop({ type: String, required: true })
    tabKey!: string;

    $store!: Vuex.ExStore;

    get dataSource() {
        const coordinates = this.$store.getters['coordinate/coordinates'];
        return coordinates.filter(
            coordinate => coordinate.season === this.tabKey
        );
    }

    async confirm(id: number) {
        await this.$store
            .dispatch('coordinate/onDeleteCoordinate', id)
            .catch((err: any) => {
                this.$emit('on-error', err);
            });
        this.$message.success('Delete complate 👏');
    }
}
</script>

<style scoped>
.coordinate-empty {
    padding-top: 20vh;
}

.coordinate-image {
    width: 240;
}

.operation-button {
    left: 0;
    text-align: right;
}
</style>
