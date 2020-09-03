<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :scroll="{ x: 1150, y: 630 }"
        :pagination="false"
        :loading="loading"
        :locale="{
            filterConfirm: $t('operation.refine'),
            filterReset: $t('operation.reset'),
            emptyText: $t('dictionary.empty')
        }"
    >
        <span slot="color" slot-scope="color">
            <a-tag :color="color">
                {{ color }}
            </a-tag>
        </span>

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

        <template slot="operation" slot-scope="record">
            <router-link :to="`/maintenance/genre/${record.key}`">
                <a-icon type="edit" />
                {{ $t('operation.edit') }}
            </router-link>
            /
            <a>
                <a-popconfirm
                    :title="$t('message.confirm.delete')"
                    placement="topRight"
                    @confirm="() => onDelete(record.key)"
                    :okText="$t('operation.yes')"
                    :cancelText="$t('operation.no')"
                >
                    <a-icon type="delete" />
                    {{ $t('operation.item.delete') }}
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

import { getTableColumns } from '@/components/genre/table';
import { Record } from '@/components/genre/type';
import { Genre } from '@/store/genre/type';

@Component
export default class GenreTable extends Vue {
    $store!: Vuex.ExStore;

    @Prop({ type: Array as () => Genre[], required: true })
    genres!: Genre[];

    @Prop({ type: Boolean, required: true })
    loading!: boolean;

    searchText = '';

    get columns() {
        const { $t } = this;
        return getTableColumns($t.bind(this));
    }

    get dataSource() {
        return this.genres.map(genre => ({
            ...genre,
            key: genre.id
        })) as Record[];
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
            .dispatch('genre/onDeleteGenre', id)
            .catch((err: any) => this.$emit('on-error', err));

        this.$emit<boolean>('set-loading', false);
    }
}
</script>

<style scoped>
.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}
</style>
