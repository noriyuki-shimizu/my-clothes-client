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
        <div id="operation_field">
            <a-button
                type="primary"
                icon="file-add"
                size="large"
                @click="onNew"
            >
                New
            </a-button>
        </div>

        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :scroll="{ x: 1000, y: 330 }"
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
                <img
                    class="brand-image"
                    :src="
                        imageLink ? imageLink : require('@/assets/no-img.png')
                    "
                />
            </span>

            <template slot="operation" slot-scope="record">
                <router-link :to="`/maintenance/brand/${record.key}`">
                    <a-icon type="edit" />
                    edit
                </router-link>
                /
                <a>
                    <a-popconfirm
                        v-if="record.deleted === 'Not deleted'"
                        title="Are you sure delete this brand?"
                        @confirm="() => onDelete(record.key)"
                        okText="Yes"
                        cancelText="No"
                    >
                        <a-icon type="delete" />
                        delete
                    </a-popconfirm>
                    <a-popconfirm
                        v-else
                        title="Are you sure restoration this brand?"
                        @confirm="() => onRestoration(record.key)"
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
import { isAxiosError } from '@/plugins/api';
import { AxiosError } from 'axios';

type Data = {
    key: number;
    name: string;
    link: string;
    imageLink: string;
    country: string;
    deleted: string;
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

    loading = false;

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
            title: 'Deleted',
            dataIndex: 'deleted',
            filters: [
                { text: 'Deleted', value: 'Deleted' },
                { text: 'Not deleted', value: 'Not deleted' }
            ],
            onFilter: (value: string, record: Data) => record.deleted === value,
            width: 150
        },
        {
            title: 'Operation',
            key: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
        }
    ];

    message: Message = {
        isShow: false,
        text: '',
        description: '',
        type: null
    };

    errorHandle(err: any) {
        this.message = {
            isShow: false,
            text: '',
            description: '',
            type: null
        };
        if (isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                const { $store, $router } = this;
                this.$warning({
                    title: 'Certification expired',
                    content: 'Please sign in again.',
                    onOk: () => {
                        $store.dispatch('user/signOut');
                        $router.push({ name: 'signIn' });
                    }
                });
                return;
            }
            this.message = {
                isShow: true,
                text: `Error (${err.message})`,
                description: `Access URL: ${err.config.url}`,
                type: 'error'
            };
        }
    }

    async created() {
        this.loading = true;
        if (!this.$store.getters['brand/brands'].length) {
            try {
                await this.$store.dispatch('brand/fetchBrands');
            } catch (err) {
                this.errorHandle(err);
            }
        }
        this.loading = false;
    }

    get dataSource() {
        const brands = this.$store.getters['brand/brands'];
        return brands.map(brand => ({
            ...brand,
            key: brand.id,
            deleted: brand.isDeleted ? 'Deleted' : 'Not deleted'
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

    onNew() {
        this.$router.push({ name: 'brandNew' });
    }

    async onDelete(id: number) {
        this.loading = true;
        try {
            await this.$store.dispatch('brand/onDeleteBrand', { id });
        } catch (err) {
            this.errorHandle(err);
        }
        this.loading = false;
    }

    async onRestoration(id: number) {
        this.loading = true;
        try {
            await this.$store.dispatch('brand/onRestorationBrand', { id });
        } catch (err) {
            this.errorHandle(err);
        }
        this.loading = false;
    }
}
</script>
<style scoped>
.alert-message {
    margin-bottom: 20px;
}

#operation_field {
    padding-bottom: 20px;
}

.operation-button {
    margin-left: 10px;
}

.brand-image {
    height: 80px;
    width: 80px;
}

.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}
</style>
