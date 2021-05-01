<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-affix :offset-top="100">
                <a-button
                    type="primary"
                    @click="
                        $router.push({
                            name: 'clothesNew'
                        })
                    "
                >
                    {{ $t('operation.new') }}
                </a-button>
            </a-affix>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.clothes')} (${clothes.length})`"
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
                    <a-form-item :label="$t('dictionary.brand.index')">
                        <a-checkbox-group
                            v-model="filteringBrands"
                            :options="filteringBrandOptions"
                        />
                    </a-form-item>
                    <a-form-item :label="$t('dictionary.shop.index')">
                        <a-checkbox-group
                            v-model="filteringShops"
                            :options="filteringShopOptions"
                        />
                    </a-form-item>
                    <a-form-item :label="$t('dictionary.genre.index')">
                        <a-checkbox-group
                            v-model="filteringGenres"
                            :options="filteringGenreOptions"
                        />
                    </a-form-item>
                    <div class="mc-operation-reset">
                        <a @click="resetFiltering">{{
                            $t('operation.reset')
                        }}</a>
                    </div>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-collapse class="mc-refine-container">
            <a-collapse-panel :header="$t('dictionary.sort.index')">
                <a-form layout="vertical">
                    <a-form-item :label="$t('dictionary.clothes.buy-date')">
                        <a-select v-model="buyDateSort" style="width: 100%">
                            <a-select-option
                                v-for="(buyDateSortItem,
                                index) in buyDateSortItems"
                                :key="index"
                                :value="buyDateSortItem.value"
                            >
                                {{ $t(buyDateSortItem.label) }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <div class="mc-operation-reset">
                        <a @click="resetSorter">{{ $t('operation.reset') }}</a>
                    </div>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-empty v-if="!clothes.length" />
        <a-list v-else :grid="{ gutter: 5, column: 2 }" :data-source="clothes">
            <a-list-item slot="renderItem" slot-scope="item">
                <a-card hoverable>
                    <img
                        class="mc-item-image"
                        slot="cover"
                        alt="Clothes image"
                        :src="
                            item.imageLink ||
                                require('@/assets/image/no-img.png')
                        "
                        @click="
                            $router.push({
                                name: 'clothesShow',
                                params: { id: item.id }
                            })
                        "
                    />
                    <template slot="actions" class="ant-card-actions">
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
                    </template>
                </a-card>
            </a-list-item>
        </a-list>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import moment from 'moment';
import { AppMessage } from 'ant-design-vue/types/message';

import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Clothes } from '@/store/clothes/type';
import { BuyDateSortItem } from '@/components/clothes/type';
import { buyDateSortItems } from '@/components/clothes/sorter';

type ClothesDispatches =
    | 'clothes/fetchClothes'
    | 'clothes/fetchAssistGenres'
    | 'clothes/fetchAssistBrands'
    | 'clothes/fetchAssistShops';

@Component
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

    filteringBrands: string[] = [];

    filteringShops: string[] = [];

    filteringGenres: string[] = [];

    buyDateSortItems: Readonly<BuyDateSortItem[]> = buyDateSortItems;

    buyDateSort: BuyDateSortItem['value'] | '' = '';

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        this.fetchClothes();
    }

    private async fetchClothes() {

        this.loading = true;

        const despatches: ClothesDispatches[] = [
            'clothes/fetchAssistGenres',
            'clothes/fetchAssistBrands',
            'clothes/fetchAssistShops',
            'clothes/fetchClothes'
        ];

        await Promise.all(
            despatches.map((despatch) => this.$store.dispatch(despatch))
        ).catch((err) => {
            this.onError(err);
        });

        this.loading = false;
    }

    resetFiltering() {
        this.filteringBrands = [];
        this.filteringShops = [];
        this.filteringGenres = [];
    }

    resetSorter() {
        this.buyDateSort = '';
    }

    get clothes(): Clothes[] {
        const clothes = this.$store.getters['clothes/clothes'];
        return [...clothes]
            .sort((a, b) => {
                const aBuyDate = moment(a.buyDate);
                const bBuyDate = moment(b.buyDate);
                if (aBuyDate.isSame(bBuyDate)) {
                    return 0;
                }
                if (this.buyDateSort === 'new') {
                    return aBuyDate.isSameOrAfter(bBuyDate) ? -1 : 1;
                }
                if (this.buyDateSort === 'old') {
                    return aBuyDate.isSameOrAfter(bBuyDate) ? 1 : -1;
                }
                return 0;
            })
            .filter((c) => {
                if (
                    this.filteringBrands.length &&
                    !this.filteringBrands.includes(c.brand.name)
                ) {
                    return false;
                }
                if (
                    this.filteringShops.length &&
                    !this.filteringShops.includes(c.shop.name)
                ) {
                    return false;
                }
                if (this.filteringGenres.length) {
                    const clothesGenres = c.genres.map((genre) => genre.name);
                    const includes = this.filteringGenres.some(
                        (filteringGenre) =>
                            clothesGenres.includes(filteringGenre)
                    );
                    if (!includes) {
                        return false;
                    }
                }
                return true;
            });
    }

    get filteringBrandOptions(): string[] {
        const brands = this.$store.getters['clothes/assistBrands'];
        return brands.map((brand) => brand.name);
    }

    get filteringShopOptions(): string[] {
        const shops = this.$store.getters['clothes/assistShops'];
        return shops.map((shop) => shop.name);
    }

    get filteringGenreOptions(): string[] {
        const genres = this.$store.getters['clothes/assistGenres'];
        return genres.map((genre) => genre.name);
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

<style>
.clothes-list-item {
    padding: 13px;
}

.detail {
    margin-left: 15px;
}

.ant-checkbox-group-item {
    margin: 0 10px 8px 0;
}
</style>
