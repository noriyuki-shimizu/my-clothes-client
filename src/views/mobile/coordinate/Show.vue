<template>
    <div>
        <h3 :style="{ marginBottom: '16px' }">Season</h3>
        <a-list>
            <a-list-item>
                <div>{{ coordinate.season }}</div>
            </a-list-item>
        </a-list>

        <h3 :style="{ margin: '16px 0' }">Coordinate</h3>
        <a-list>
            <a-list-item>
                <div>
                    <img class="coordinate-image" :src="coordinate.imageLink" />
                </div>
            </a-list-item>
        </a-list>

        <h3 :style="{ margin: '16px 0' }">Coordinate item</h3>
        <a-list bordered :data-source="items">
            <a-list-item slot="renderItem" slot-scope="item">
                <div class="container">
                    <div>
                        <img class="item-image" :src="item.imageLink" />
                    </div>
                    <div class="detail">
                        <clothes-detail :item="item" />
                    </div>
                </div>
            </a-list-item>
        </a-list>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { Record } from '@/components/coordinate/type';
import ClothesDetail from '@/components/clothes/Detail.vue';

@Component({
    components: {
        ClothesDetail
    }
})
export default class Show extends Vue {
    $store!: Vuex.ExStore;

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileCoordinate' });
        }

        this.$store.dispatch('coordinate/fetchCoordinate', Number(id));
    }

    beforeDestroy() {
        this.$store.commit('coordinate/resetCoordinate');
    }

    get coordinate() {
        return this.$store.getters['coordinate/coordinate'];
    }

    get items() {
        const { usedCoordinates } = this.coordinate;
        return usedCoordinates.map(usedCoordinate => {
            const { id, price, ...items } = usedCoordinate;
            return {
                key: usedCoordinate.id,
                price: String(usedCoordinate.price),
                ...items
            };
        }) as Record[];
    }
}
</script>

<style scoped>
.coordinate-image {
    width: 43vw;
}

.item-image {
    height: 25vh;
    width: 35vw;
}

.ant-list-item {
    padding: 15px;
}

.container {
    display: flex;
}

.detail {
    margin-left: 15px;
}
</style>
