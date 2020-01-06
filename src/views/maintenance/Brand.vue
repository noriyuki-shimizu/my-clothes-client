<template>
    <div>
        <h1>Brand</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :scroll="{ x: 1000, y: 300 }"
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
                        e =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
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
                <img class="brand-image" :src="imageLink" />
            </span>

            <template slot="edit" slot-scope="record">
                <a @click="() => onEdit(record.key)">edit</a>
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
                                fragment.toLowerCase() ===
                                    searchText.toLowerCase()
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
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Column } from 'ant-design-vue/types/table/column';
import * as Vuex from 'vuex';
import { isAxiosError } from '../../plugins/api';

type Data = {
    key: number;
    name: string;
    link: string;
    imageLink: string;
    country: string;
    isDeleted: string;
};

type Message = {
    isShow: boolean;
    text: string;
    description: string;
    type: 'warning' | 'error' | null;
};

@Component
export default class Brand extends Vue {
    $store!: Vuex.ExStore;
    searchText = '';
    columns: Partial<Column>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Data) =>
                record.name
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            width: 150
        },
        {
            title: 'Image',
            dataIndex: 'imageLink',
            key: 'imageLink',
            scopedSlots: { customRender: 'imageLink' },
            width: 120
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Data) =>
                record.country
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            width: 150
        },
        {
            title: 'Is deleted',
            dataIndex: 'isDeleted',
            filters: [
                { text: 'Deleted', value: 'Deleted' },
                { text: 'Not deleted', value: 'Not deleted' }
            ],
            onFilter: (value: string, record: Data) =>
                record.isDeleted === value,
            width: 150
        },
        {
            title: 'Edit',
            key: 'edit',
            fixed: 'right',
            width: 100,
            scopedSlots: { customRender: 'edit' }
        }
    ];

    message: Message = {
        isShow: false,
        text: '',
        description: '',
        type: null
    };

    async created() {
        await this.$store.dispatch('brand/fetchBrands').catch((err: any) => {
            if (isAxiosError(err)) {
                this.message = {
                    isShow: true,
                    text: `Error (${err.message})`,
                    description: `Access URL: ${err.config.url}`,
                    type: 'error'
                };
            }
        });
    }

    get dataSource() {
        const brands = this.$store.getters['brand/brands'];
        return brands.map(brand => ({
            ...brand,
            key: brand.id,
            isDeleted: brand.isDeleted ? 'Deleted' : 'Not deleted'
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

    onEdit(key: number) {
        console.log('Edit event: ', key);
    }
}
</script>
<style scoped>
.alert-message {
    margin-bottom: 20px;
}

.brand-image {
    height: 100px;
    width: 100px;
}

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}
</style>
