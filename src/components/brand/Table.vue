<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: 1000, y: 570 }"
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
                :placeholder="column.dataIndex"
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

        <template slot="operation" slot-scope="record">
            <router-link :to="`/maintenance/brand/${record.key}`">
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

import { getTableColumns } from '@/components/brand/table';
import { Record } from '@/components/brand/type';
import { Brand } from '@/store/brand/type';
import { Pagination } from 'ant-design-vue';
import storageKey from '@/util/storageKey';

@Component
export default class BrandTable extends Vue {
    $store!: Vuex.ExStore;

    searchText = '';

    currentPage: number = 1;

    @Prop({ type: Array as () => Brand[], required: true })
    brands!: Brand[];

    @Prop({ type: Boolean, required: true })
    loading!: boolean;

    created() {
        const currentPage = sessionStorage.getItem(
            storageKey.BRAND_CURRENT_PAGE_NUMBER
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
        return this.brands.map((brand) => ({
            ...brand,
            key: brand.id,
            deleted: brand.isDeleted ? deletedText : notDeletedText
        })) as Record[];
    }

    onPageChange(pagination: Pagination) {
        const { current } = pagination;
        if (current) {
            this.currentPage = current;
            sessionStorage.setItem(
                storageKey.BRAND_CURRENT_PAGE_NUMBER,
                String(current)
            );
        }
    }

    isDeleted(record: Record): boolean {
        const brand = this.brands.find((b) => b.id === record.key) as Brand;
        return brand.isDeleted;
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
        this.$emit<boolean>('set-loading', true);
        await this.$store
            .dispatch('brand/onDeleteBrand', id)
            .catch((err: any) => this.$emit('on-error', err));
        this.$emit<boolean>('set-loading', false);
    }

    async onRestoration(id: number) {
        this.$emit<boolean>('set-loading', true);
        await this.$store
            .dispatch('brand/onRestorationBrand', id)
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
