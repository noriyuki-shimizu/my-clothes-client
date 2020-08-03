<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :scroll="{ x: 1850, y: 570 }"
        :pagination="{ pageSize: 50 }"
        :loading="loading"
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

        <template slot="operation" slot-scope="record">
            <router-link :to="`/maintenance/clothes/${record.key}`">
                <a-icon type="edit" />
                {{ $t('operation.edit') }}
            </router-link>
            /
            <a>
                <a-popconfirm
                    v-if="!isDeleted(record)"
                    :title="$t('message.confirm.delete')"
                    placement="topRight"
                    @confirm="() => onDelete(record.key)"
                    :okText="$t('operation.yes')"
                    :cancelText="$t('operation.no')"
                >
                    <a-icon type="delete" />
                    {{ $t('operation.item.delete') }}
                </a-popconfirm>
                <a-popconfirm
                    v-else
                    :title="$t('message.confirm.restoration')"
                    @confirm="() => onRestoration(record.key)"
                    placement="topRight"
                    :okText="$t('operation.yes')"
                    :cancelText="$t('operation.no')"
                >
                    <a-icon type="undo" />
                    {{ $t('operation.item.restoration') }}
                </a-popconfirm>
            </a>
        </template>
    </a-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';

import { getColumnsForTable } from '@/components/clothes/table';
import { Record } from '@/components/clothes/type';
import { Clothes } from '@/store/clothes/type';
import { priceFormat } from '@/filters/number-format';

@Component({
    filters: {
        priceFormat
    }
})
export default class ClothesTable extends Vue {
    $store!: Vuex.ExStore;

    @Prop({ type: Array as () => Clothes[], required: true })
    clothes!: Clothes[];

    @Prop({ type: Boolean, required: true })
    loading!: boolean;

    searchText = '';

    get columns() {
        const { $t } = this;
        return getColumnsForTable($t.bind(this), {
            brands: this.$store.getters['clothes/assistBrands'],
            shops: this.$store.getters['clothes/assistShops'],
            genres: this.$store.getters['clothes/assistGenres']
        });
    }

    get dataSource() {
        const { clothes } = this;
        const deletedText = this.$t('status.item.delete');
        const notDeletedText = this.$t('status.item.not-delete');

        return clothes.map(c => {
            const {
                id,
                imageLink,
                brand,
                shop,
                genres,
                price,
                buyDate,
                comment,
                satisfaction,
                isDeleted
            } = c;
            return {
                key: id,
                imageLink,
                brandName: brand.name,
                shopName: shop.name,
                genres: genres,
                price,
                buyDate,
                comment,
                satisfaction,
                deleted: c.isDeleted ? deletedText : notDeletedText
            };
        }) as Record[];
    }

    isDeleted(record: Record): boolean {
        const item = this.clothes.find(c => c.id === record.key) as Clothes;
        return item.isDeleted;
    }

    handleSearch(selectedKeys: string[], confirm: Function) {
        confirm();
        [this.searchText] = selectedKeys;
    }

    handleReset(clearFilters: Function) {
        clearFilters();
        this.searchText = '';
    }

    async onDelete(id: number) {
        this.$emit('on-reset-message');
        this.$emit<boolean>('set-loading', true);

        await this.$store
            .dispatch('clothes/onDeleteClothes', id)
            .catch((err: any) => this.$emit('on-error', err));

        this.$emit<boolean>('set-loading', false);
    }

    async onRestoration(id: number) {
        this.$emit('on-reset-message');
        this.$emit<boolean>('set-loading', true);

        await this.$store
            .dispatch('clothes/onRestorationClothes', id)
            .catch((err: any) => this.$emit('on-error', err));

        this.$emit<boolean>('set-loading', false);
    }
}
</script>

<style scoped>
@import '../../assets/css/table/ant.css';

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}

.column-price {
    text-align: right !important;
}
</style>
