<template>
    <a-table
        class="select-item-table"
        :dataSource="tableItems"
        :columns="columns"
        :scroll="{ x: 1650, y: 570 }"
        :pagination="{ pageSize: 50 }"
        :loading="tableLoading"
        :rowSelection="{
            selectedRowKeys,
            onSelect
        }"
        :locale="{
            filterConfirm: $t('operation.refine'),
            filterReset: $t('operation.reset'),
            emptyText: $t('dictionary.empty')
        }"
    >
        <span slot="genres" slot-scope="genres">
            <a-tag v-for="(genre, i) in genres" :color="genre.color" :key="i">
                {{ genre.name }}
            </a-tag>
        </span>

        <span slot="price" slot-scope="price">
            <div class="column-price">
                {{ price | priceFormat }}
            </div>
        </span>

        <span slot="satisfaction" slot-scope="satisfaction">
            <a-rate
                :defaultValue="satisfaction"
                disabled
                allow-half
                style="text-align: center !important"
            />
        </span>

        <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
        />

        <span slot="imageLink" slot-scope="imageLink">
            <img
                class="table-image"
                :src="imageLink || require('@/assets/image/no-img.png')"
            />
        </span>
    </a-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';

import { priceFormat } from '@/filters/number-format';
import { Record } from './type';
import { getColumnsForFormTable } from './table';

@Component({
    filters: {
        priceFormat
    }
})
export default class ClothesFormTable extends Vue {
    @Prop({ type: Array as () => Record[] })
    tableItems!: Record[];

    @Prop({ type: Array as () => number[], default: [] })
    selectedRowKeys?: number[];

    tableLoading = false;

    get columns() {
        const { $t } = this;
        return getColumnsForFormTable($t.bind(this), {
            brands: this.$store.getters['clothes/assistBrands'],
            shops: this.$store.getters['clothes/assistShops'],
            genres: this.$store.getters['clothes/assistGenres']
        });
    }

    async created() {
        this.tableLoading = true;

        await Promise.all([
            this.$store.dispatch('coordinate/fetchCoordinateItems'),
            this.$store.dispatch('clothes/fetchAssistGenres'),
            this.$store.dispatch('clothes/fetchAssistBrands'),
            this.$store.dispatch('clothes/fetchAssistShops')
        ]).catch((err) => {
            this.$emit('on-error', err);
        });

        this.tableLoading = false;
    }

    onSelect(record: Record) {
        this.$emit('on-select', record.key);
    }
}
</script>

<style scoped>
@import '../../assets/css/table/ant.css';
</style>
