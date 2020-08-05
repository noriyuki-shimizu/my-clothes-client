<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'brandNew'
                    })
                "
            >
                {{ $t('operation.new') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.brand')} (${brands.length})`"
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

        <a-empty v-if="!brands.length" />
        <a-list v-else bordered :data-source="brands">
            <a-list-item
                class="brand-list-item"
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
                                    name: 'brandShow',
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

import Detail from '@/components/brand/Detail.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Brand } from '@/store/brand/type';

@Component({
    components: {
        Detail
    }
})
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

    created() {
        this.fetchBrands();
    }

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    private async fetchBrands() {
        this.loading = true;

        this.message = resetMessage();
        await this.$store.dispatch('brand/fetchBrands').catch(this.onError);

        this.loading = false;
    }

    get brands(): Brand[] {
        return this.$store.getters['brand/brands'];
    }

    async onDelete(id: number) {
        this.loading = true;
        this.setMessage();

        await this.$store
            .dispatch('brand/onDeleteBrand', id)
            .catch(this.onError);

        this.loading = false;
    }

    async onRestoration(id: number) {
        this.loading = true;
        this.setMessage();

        await this.$store
            .dispatch('brand/onRestorationBrand', id)
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
        const { $t } = this;
        handleForbiddenError(err, $t.bind(this), this.$store, this.$router);

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
.brand-list-item {
    padding: 13px;
}

.detail {
    margin-top: 10px;
    margin-left: 15px;
}
</style>
