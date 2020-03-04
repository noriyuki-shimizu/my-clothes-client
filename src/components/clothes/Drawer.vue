<template>
    <div>
        <a-drawer
            title="Coordinate item"
            placement="bottom"
            height="600"
            :closable="false"
            @close="() => $emit('on-close')"
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
                    xxl: 6
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
                                <clothes-detail :item="item" />
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
                            params: { id: coordinateId }
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CoordinateItem } from '@/store/coordinate/type';

import ClothesDetail from '@/components/clothes/Detail.vue';

@Component({
    components: {
        ClothesDetail
    }
})
export default class CoordinateItemDrawer extends Vue {
    @Prop({ type: Number })
    coordinateId?: number;

    @Prop({ type: Array as () => CoordinateItem[] })
    coordinateItems!: CoordinateItem[];

    @Prop({ type: Boolean, required: true })
    visible!: boolean;
}
</script>

<style scoped>
.coordinate-item-image {
    height: 250px;
    width: 220;
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
</style>
