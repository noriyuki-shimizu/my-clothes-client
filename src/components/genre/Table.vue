<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :scroll="{ x: 700, y: 630 }"
        :pagination="false"
        :loading="loading"
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

        <template slot="operation" slot-scope="record">
            <router-link :to="`/maintenance/genre/${record.key}`">
                <a-icon type="edit" />
                edit
            </router-link>
            /
            <a>
                <a-popconfirm
                    title="Are you sure delete this genre?"
                    placement="topRight"
                    @confirm="() => onDelete(record.key)"
                    okText="Yes"
                    cancelText="No"
                >
                    <a-icon type="delete" />
                    delete
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

import { columns, Record } from '@/components/genre/table';

@Component
export default class GenreTable extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    searchText = '';

    columns = columns;

    async created() {
        this.loading = true;
        try {
            await this.$store.dispatch('genre/fetchGenres');
        } catch (err) {
            this.$emit('onError', err);
        }
        this.loading = false;
    }

    get genres() {
        return this.$store.getters['genre/genres'];
    }

    get dataSource() {
        return this.genres.map(genre => ({
            ...genre,
            key: genre.id
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
        this.loading = true;
        try {
            await this.$store.dispatch('genre/onDeleteGenre', { id });
        } catch (err) {
            this.$emit('onError', err);
        }
        this.loading = false;
    }
}
</script>

<style scoped>
.genre-image {
    height: 80px;
    width: 80px;
}

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}
</style>
