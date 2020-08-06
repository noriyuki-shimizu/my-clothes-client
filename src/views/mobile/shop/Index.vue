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
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <a-empty v-if="!shops.length" />
        <a-list v-else bordered :data-source="shops">
            <a-list-item
                class="shop-list-item"
                slot="renderItem"
                slot-scope="item"
            >
                <div class="mc-item-container">
                    <div>
                        <img
                            class="mc-item-image"
                            :src="
                                item.imageLink ||
                                    require('@/assets/image/no-img.png')
                            "
                            @click="
                                $router.push({
                                    name: 'shopShow',
                                    params: { id: item.id }
                                })
                            "
                        />
                    </div>
                    <div class="detail">
                        <detail :item="item" />
                        <a>
                            <a-popconfirm
                                v-if="item.isDeleted"
                                @confirm="() => onRestoration(item.id)"
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
                                @confirm="() => onDelete(item.id)"
                                placement="topRight"
                                :okText="$t('operation.yes')"
                                :cancelText="$t('operation.no')"
                            >
                                <a-icon type="delete" />
                                {{ $t('operation.item.delete') }}
                            </a-popconfirm>
                        </a>
                    </div>
                </div>
            </a-list-item>
        </a-list>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import Detail from '@/components/shop/Detail.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Shop } from '@/store/shop/type';

@Component({
    components: {
        Detail
    }
})
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

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
        return this.$store.getters['shop/shops'];
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
