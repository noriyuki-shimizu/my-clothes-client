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
                :src="imageLink ? imageLink : require('@/assets/no-img.png')"
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

import { getColumns, Record } from '@/components/clothes/table';

@Component
export default class ClothesTable extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    searchText = '';

    columns = getColumns(
        this.assistBrands,
        this.assistShops,
        this.assistGenres
    );

    async created() {
        this.$emit('onResetMessage');
        this.loading = true;

        await Promise.all([
            this.$store.dispatch('clothes/fetchClothes'),
            this.$store.dispatch('clothes/fetchAssistGenres'),
            this.$store.dispatch('clothes/fetchAssistBrands'),
            this.$store.dispatch('clothes/fetchAssistShops')
        ]).catch(err => {
            this.$emit('onErrorHandle', err);
        });

        this.loading = false;
    }

    get dataSource() {
        const clothes = this.$store.getters['clothes/clothes'];
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

    get assistGenres() {
        return this.$store.getters['clothes/assistGenres'];
    }

    get assistBrands() {
        return this.$store.getters['clothes/assistBrands'];
    }

    get assistShops() {
        return this.$store.getters['clothes/assistShops'];
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
        this.$emit('onResetMessage');
        this.loading = true;
        try {
            await this.$store.dispatch('clothes/onDeleteClothes', { id });
        } catch (err) {
            this.$emit('onError', err);
        }
        this.loading = false;
    }

    async onRestoration(id: number) {
        this.$emit('onResetMessage');
        this.loading = true;
        try {
            await this.$store.dispatch('clothes/onRestorationClothes', { id });
        } catch (err) {
            this.$emit('onError', err);
        }
        this.loading = false;
    }
}
</script>

<style scoped>
.clothes-image {
    height: 140px;
    width: 120px;
}

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}

.column-price {
    text-align: right !important;
}
</style>
