<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'shopNew'
                    })
                "
            >
                {{ $t('operation.new') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.shop')} (${shops.length})`"
            :subTitle="$t('title.sub-title.item-list')"
        />
        <a-divider class="mc-pipe" />

        <a-alert
            class="mc-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <a-collapse class="mc-refine-container">
            <a-collapse-panel :header="$t('operation.refine')">
                <a-form layout="vertical">
                    <a-form-item :label="$t('dictionary.shop.name')">
                        <a-auto-complete
                            v-model="filteringShopName"
                            @change="onChangeFilteringShopName"
                        >
                            <template slot="dataSource">
                                <a-select-option
                                    v-for="name in filteringShopNames"
                                    :key="name"
                                >
                                    {{ name }}
                                </a-select-option>
                            </template>
                        </a-auto-complete>
                    </a-form-item>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-empty v-if="!shops.length" />
        <a-list v-else :grid="{ gutter: 5, column: 2 }" :data-source="shops">
            <a-list-item slot="renderItem" slot-scope="shop">
                <a-card hoverable :title="shop.name">
                    <a slot="extra" href="#">
                        <business-status
                            :isBusinessStatus="shop.isBusinessStatus"
                            text=""
                        />
                    </a>
                    <img
                        class="mc-item-image"
                        slot="cover"
                        alt="Shop image"
                        :src="
                            shop.imageLink ||
                                require('@/assets/image/no-img.png')
                        "
                        @click="
                            $router.push({
                                name: 'shopShow',
                                params: { id: shop.id }
                            })
                        "
                    />
                    <template slot="actions" class="ant-card-actions">
                        <a-popconfirm
                            v-if="shop.isDeleted"
                            @confirm="() => onRestoration(shop.id)"
                            :title="$t('message.confirm.restoration')"
                            placement="topRight"
                            :okText="$t('operation.yes')"
                            :cancelText="$t('operation.no')"
                        >
                            <a-icon type="undo" />
                            {{ $t('operation.item.restoration') }}
                        </a-popconfirm>
                        <a-popconfirm
                            v-else
                            :title="$t('message.confirm.delete')"
                            @confirm="() => onDelete(shop.id)"
                            placement="topRight"
                            :okText="$t('operation.yes')"
                            :cancelText="$t('operation.no')"
                        >
                            <a-icon type="delete" />
                            {{ $t('operation.item.delete') }}
                        </a-popconfirm>
                    </template>
                </a-card>
            </a-list-item>
        </a-list>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Shop } from '@/store/shop/type';
import BusinessStatus from '@/components/shop/BusinessStatus.vue';
import { textIncludes } from '@/util/text';

@Component({
    components: {
        BusinessStatus
    }
})
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

    filteringShopName: string = '';

    filteringShopNames: string[] = [];

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        this.fetchShops();
    }

    private async fetchShops() {
        this.loading = true;

        this.message = resetMessage();
        await this.$store.dispatch('shop/fetchShops').catch(this.onError);

        this.loading = false;
    }

    get shops(): Shop[] {
        const shops = this.$store.getters['shop/shops'];
        const trimValue = this.filteringShopName.trim();

        if (trimValue) {
            return shops.filter(shop => textIncludes(shop.name, trimValue));
        }
        return shops;
    }

    onChangeFilteringShopName(value: string) {
        const shops = this.$store.getters['shop/shops'];
        const shopNames = shops.map(shop => shop.name);
        const trimValue = value.trim();
        if (trimValue) {
            this.filteringShopNames = shopNames.filter(name =>
                textIncludes(name, trimValue)
            );
            return;
        }
        this.filteringShopNames = [];
    }

    async onDelete(id: number) {
        this.loading = true;
        this.setMessage();

        await this.$store.dispatch('shop/onDeleteShop', id).catch(this.onError);

        this.loading = false;
    }

    async onRestoration(id: number) {
        this.loading = true;
        this.setMessage();

        await this.$store
            .dispatch('shop/onRestorationShop', id)
            .catch(this.onError);

        this.loading = false;
    }

    @Emit('set-message')
    setMessage(message?: AppMessage) {
        this.message = message || resetMessage();
    }

    @Emit('on-error')
    onError(err: any) {
        this.message = resetMessage();
        handleForbiddenError(err, this.$store, this.$router);

        const { data } = err.response;
        this.message = {
            isShow: true,
            text: this.$t('status.error').toString(),
            description: this.$t(data).toString(),
            type: 'error'
        };
    }
}
</script>

<style scoped>
.shop-list-item {
    padding: 13px;
}

.detail {
    margin-top: 10px;
    margin-left: 15px;
}
</style>
