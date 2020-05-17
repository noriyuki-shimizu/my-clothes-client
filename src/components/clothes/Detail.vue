<template>
    <div>
        <div>Brand ... {{ item.brandName }}</div>
        <div>Shop ... {{ item.shopName }}</div>
        <div>
            Price ...
            {{ item.price.toLocaleString() }}
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
            <a-rate :defaultValue="item.satisfaction" disabled />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { ClothesItem } from '@/store/clothes/type';
import { Record } from './type';

@Component
export default class ClothesDetail extends Vue {
    @Prop({ type: Object as () => Record | ClothesItem })
    item!: Record | ClothesItem;
}
</script>

<style scoped></style>
