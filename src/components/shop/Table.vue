<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :scroll="{ x: 1600, y: 570 }"
        :pagination="{ pageSize: 30 }"
        :loading="loading"
    >
        <div
            slot="filterDropdown"
            slot-scope="{
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
                column
            }"
            style="padding: 8px"
        >
            <a-input
                :placeholder="`Search ${column.dataIndex}`"
                :value="selectedKeys[0]"
                @change="
                    e => setSelectedKeys(e.target.value ? [e.target.value] : [])
                "
                @pressEnter="() => handleSearch(selectedKeys, confirm)"
                style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <a-button
                type="primary"
                @click="() => handleSearch(selectedKeys, confirm)"
                icon="search"
                size="small"
                style="width: 90px; margin-right: 8px"
                >Search</a-button
            >
            <a-button
                @click="() => handleReset(clearFilters)"
                size="small"
                style="width: 90px"
                >Reset</a-button
            >
        </div>

        <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
        />

        <span slot="imageLink" slot-scope="imageLink">
            <img
                class="shop-image"
                :src="imageLink ? imageLink : require('@/assets/no-img.png')"
            />
        </span>

        <template slot="operation" slot-scope="record">
            <router-link :to="`/maintenance/shop/${record.key}`">
                <a-icon type="edit" />
                edit
            </router-link>
            /
            <a>
                <a-popconfirm
                    v-if="record.deleted === 'Not deleted'"
                    title="Are you sure delete this shop?"
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
                    title="Are you sure restoration this shop?"
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

        <template slot="customRender" slot-scope="text">
            <span v-if="searchText">
                <template
                    v-for="(fragment, i) in text
                        .toString()
                        .split(
                            new RegExp(
                                `(?<=${searchText})|(?=${searchText})`,
                                'i'
                            )
                        )"
                >
                    <mark
                        v-if="
                            fragment.toLowerCase() === searchText.toLowerCase()
                        "
                        :key="i"
                        class="highlight"
                        >{{ fragment }}</mark
                    >
                    <template v-else>{{ fragment }}</template>
                </template>
            </span>
            <template v-else>{{ text }}</template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';

import { columns } from '@/components/shop/table';
import { Record } from '@/components/shop/type';

@Component
export default class ShopTable extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    searchText = '';

    columns = columns;

    async created() {
        this.$emit('onResetMessage');

        if (!this.shops.length) {
            this.loading = true;
            await this.$store
                .dispatch('shop/fetchShops')
                .catch((err: any) => this.$emit('onError', err));
            this.loading = false;
        }
    }

    get shops() {
        return this.$store.getters['shop/shops'];
    }

    get dataSource() {
        return this.shops.map(shop => ({
            ...shop,
            key: shop.id,
            deleted: shop.isDeleted ? 'Deleted' : 'Not deleted'
        }));
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

        await this.$store
            .dispatch('shop/onDeleteShop', id)
            .catch((err: any) => this.$emit('onError', err));

        this.loading = false;
    }

    async onRestoration(id: number) {
        this.$emit('onResetMessage');
        this.loading = true;

        await this.$store
            .dispatch('shop/onRestorationShop', id)
            .catch((err: any) => this.$emit('onError', err));

        this.loading = false;
    }
}
</script>

<style scoped>
.shop-image {
    height: 110px;
    width: 110px;
}

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}
</style>
