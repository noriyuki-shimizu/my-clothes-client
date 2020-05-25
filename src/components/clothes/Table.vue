<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :scroll="{ x: 1850, y: 570 }"
        :pagination="{ pageSize: 50 }"
        :loading="loading"
    >
        <span slot="genres" slot-scope="genres">
            <a-tag v-for="(genre, i) in genres" :color="genre.color" :key="i">
                {{ genre.name }}
            </a-tag>
        </span>

        <span slot="price" slot-scope="price">
            <div class="column-price">
                {{ price }}
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
                class="clothes-image"
                :src="
                    imageLink ? imageLink : require('@/assets/image/no-img.png')
                "
            />
        </span>

        <template slot="operation" slot-scope="record">
            <router-link :to="`/maintenance/clothes/${record.key}`">
                <a-icon type="edit" />
                edit
            </router-link>
            /
            <a>
                <a-popconfirm
                    v-if="record.deleted === 'Not deleted'"
                    title="Are you sure delete this clothes?"
                    placement="topRight"
                    @confirm="() => onDelete(record.key)"
                    okText="Yes"
                    cancelText="No"
                >
                    <a-icon type="delete" />
                    delete
                </a-popconfirm>
                <a-popconfirm
                    v-else
                    title="Are you sure restoration this clothes?"
                    @confirm="() => onRestoration(record.key)"
                    placement="topRight"
                    okText="Yes"
                    cancelText="No"
                >
                    <a-icon type="undo" />
                    restoration
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

@Component
export default class ClothesTable extends Vue {
    $store!: Vuex.ExStore;

    @Prop({ type: Array as () => Clothes[], required: true })
    clothes!: Clothes[];

    @Prop({ type: Boolean, required: true })
    loading!: boolean;

    searchText = '';

    columns = getColumnsForTable(
        this.$store.getters['clothes/assistBrands'],
        this.$store.getters['clothes/assistShops'],
        this.$store.getters['clothes/assistGenres']
    );

    get dataSource() {
        const { clothes } = this;
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
                price: price.toLocaleString(),
                buyDate,
                comment,
                satisfaction,
                deleted: c.isDeleted ? 'Deleted' : 'Not deleted'
            };
        }) as Record[];
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
.clothes-image {
    height: 160px;
    max-width: 140px;
}

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}

.column-price {
    text-align: right !important;
}
</style>
