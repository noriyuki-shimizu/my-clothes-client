<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'mobileClothesNew'
                    })
                "
            >
                New
            </a-button>
        </div>

        <a-page-header title="Clothes" subTitle="item list" />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <a-empty v-if="!clothes.length" />
        <a-list v-else bordered :data-source="clothes">
            <a-list-item
                class="clothes-list-item"
                slot="renderItem"
                slot-scope="item"
            >
                <div class="mc-item-container">
                    <div>
                        <img
                            class="mc-item-image"
                            :src="item.imageLink"
                            @click="
                                $router.push({
                                    name: 'mobileClothesShow',
                                    params: { id: item.id }
                                })
                            "
                        />
                    </div>
                    <div class="detail">
                        <detail :item="toClothesItem(item)" />
                        <a>
                            <a-popconfirm
                                v-if="item.isDeleted"
                                @confirm="() => onRestoration(item.id)"
                                title="Are you sure restoration this clothes?"
                                okText="Yes"
                                cancelText="No"
                            >
                                <a-icon type="undo" />
                                restoration
                            </a-popconfirm>
                            <a-popconfirm
                                v-else
                                title="Are you sure delete this clothes?"
                                @confirm="() => onDelete(item.id)"
                                okText="Yes"
                                cancelText="No"
                            >
                                <a-icon type="delete" />
                                delete
                            </a-popconfirm>
                        </a>
                    </div>
                </div>
            </a-list-item>
        </a-list>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import Detail from '@/components/clothes/Detail.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { ClothesItem, Clothes } from '@/store/clothes/type';

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
        this.fetchClothes();
    }

    private async fetchClothes() {
        this.loading = true;

        this.message = resetMessage();
        await this.$store.dispatch('clothes/fetchClothes').catch(this.onError);

        this.loading = false;
    }

    get clothes(): Clothes[] {
        return this.$store.getters['clothes/clothes'];
    }

    toClothesItem(clothes: Clothes): ClothesItem {
        const imageLink = clothes.imageLink || '';
        const comment = clothes.comment || '';
        const satisfaction = clothes.satisfaction || 0;

        return {
            id: clothes.id,
            imageLink,
            brandName: clothes.brand.name,
            shopName: clothes.shop.name,
            genres: clothes.genres.map(genre => ({
                name: genre.name,
                color: genre.color
            })),
            price: clothes.price,
            buyDate: clothes.buyDate,
            comment,
            satisfaction
        };
    }

    async onDelete(id: number) {
        this.loading = true;
        this.setMessage();

        await this.$store
            .dispatch('clothes/onDeleteClothes', id)
            .catch(this.onError);

        this.loading = false;
    }

    async onRestoration(id: number) {
        this.loading = true;
        this.setMessage();

        await this.$store
            .dispatch('clothes/onRestorationClothes', id)
            .catch(this.onError);

        this.loading = false;
    }

    @Emit('set-message')
    setMessage(message?: AppMessage) {
        this.message = message || resetMessage();
    }

    @Emit('on-error')
    onError(err: any) {
        handleForbiddenError(err, this.$store, this.$router);

        this.setMessage({
            isShow: true,
            text: `Error (${err.message})`,
            description: err.response
                ? err.response.data
                : `Access URL: ${err.config.url}`,
            type: 'error'
        });
    }
}
</script>

<style scoped>
.clothes-list-item {
    padding: 13px;
}

.detail {
    margin-left: 15px;
}
</style>
