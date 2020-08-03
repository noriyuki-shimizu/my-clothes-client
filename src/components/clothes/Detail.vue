<template>
    <div>
        <div>{{ $t('dictionary.brand.index') }} ... {{ item.brandName }}</div>
        <div>{{ $t('dictionary.shop.index') }} ... {{ item.shopName }}</div>
        <div>
            {{ $t('dictionary.price') }} ...
            {{ item.price | priceFormat }}
        </div>
        <div>
            {{ $t('dictionary.genre.index') }} ...
            <a-tag
                v-for="(genre, index) in item.genres"
                :key="index"
                :color="genre.color"
            >
                {{ genre.name }}
            </a-tag>
        </div>
        <div>
            {{ $t('dictionary.clothes.buy-date') }} ... {{ item.buyDate }}
        </div>
        <div>
            <a-rate :value="item.satisfaction" disabled allow-half />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { ClothesItem } from '@/store/clothes/type';
import { priceFormat } from '@/filters/number-format';
import { Record } from './type';

@Component({
    filters: {
        priceFormat
    }
})
export default class ClothesDetail extends Vue {
    @Prop({ type: Object as () => Record | ClothesItem })
    item!: Record | ClothesItem;
}
</script>

<style scoped></style>
