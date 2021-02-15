<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: 1810, y: 570 }"
        :pagination="{
            current: currentPage,
            pageSize: 30
        }"
        @change="onPageChange"
        :locale="{
            filterConfirm: $t('operation.refine'),
            filterReset: $t('operation.reset'),
            emptyText: $t('dictionary.empty')
        }"
        size="middle"
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
                    (e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
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
            >
                {{ $t('operation.search') }}
            </a-button>
            <a-button
                @click="() => handleReset(clearFilters)"
                size="small"
                style="width: 90px"
            >
                {{ $t('operation.reset') }}
            </a-button>
        </div>

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

        <span slot="link" slot-scope="link">
            <a-tooltip v-if="link" placement="topLeft">
                <template slot="title">
                    {{ $t('message.info.go-site') }}
                </template>
                <a v-if="link" :href="link" target="_blank">{{ link }}</a>
            </a-tooltip>
        </span>

        <span slot="address" slot-scope="address">
            <a-tooltip v-if="address" placement="topLeft">
                <template slot="title">
                    {{ $t('message.info.show-google-map') }}
                </template>
                <a
                    :href="
                        `https://maps.google.co.jp/maps?q=${encodeURI(address)}`
                    "
                    target="_blank"
                >
                    {{ address }}
                </a>
            </a-tooltip>
        </span>

        <span slot="isBusinessStatus" slot-scope="isBusinessStatus">
            <business-status :isBusinessStatus="isBusinessStatus" />
        </span>

        <template slot="operation" slot-scope="record">
            <router-link :to="`/maintenance/shop/${record.key}`">
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

import { getTableColumns } from '@/components/shop/table';
import { Record } from '@/components/shop/type';
import { Shop } from '@/store/shop/type';
import storageKey from '@/util/storageKey';
import { Pagination } from 'ant-design-vue';
import BusinessStatus from './BusinessStatus.vue';

@Component({
    components: {
        BusinessStatus
    }
})
export default class ShopTable extends Vue {
    $store!: Vuex.ExStore;

    @Prop({ type: Array as () => Shop[], required: true })
    shops!: Shop[];

    @Prop({ type: Boolean, required: true })
    loading!: boolean;

    searchText = '';

    currentPage: number = 1;

    created() {
        const currentPage = sessionStorage.getItem(
            storageKey.SHOP_CURRENT_PAGE_NUMBER
        );
        this.currentPage = Number(currentPage) || 1;
    }

    get columns() {
        const { $t } = this;
        return getTableColumns($t.bind(this));
    }

    get dataSource() {
        const deletedText = this.$t('status.item.delete');
        const notDeletedText = this.$t('status.item.not-delete');
        return this.shops.map((shop) => ({
            ...shop,
            key: shop.id,
            deleted: shop.isDeleted ? deletedText : notDeletedText
        })) as Record[];
    }

    onPageChange(pagination: Pagination) {
        const { current } = pagination;
        if (current) {
            this.currentPage = current;
            sessionStorage.setItem(
                storageKey.SHOP_CURRENT_PAGE_NUMBER,
                String(current)
            );
        }
    }

    isDeleted(record: Record): boolean {
        const shop = this.shops.find((s) => s.id === record.key) as Shop;
        return shop.isDeleted;
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
            .dispatch('shop/onDeleteShop', id)
            .catch((err: any) => this.$emit('on-error', err));

        this.$emit<boolean>('set-loading', false);
    }

    async onRestoration(id: number) {
        this.$emit('on-reset-message');
        this.$emit<boolean>('set-loading', true);

        await this.$store
            .dispatch('shop/onRestorationShop', id)
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
</style>
