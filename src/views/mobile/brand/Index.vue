<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-affix :offset-top="100">
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
            </a-affix>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.brand')} (${brands.length})`"
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
                    <a-form-item :label="$t('dictionary.brand.name')">
                        <a-auto-complete
                            v-model="filteringBrandName"
                            @change="onChangeFilteringBrandName"
                        >
                            <template slot="dataSource">
                                <a-select-option
                                    v-for="name in filteringBrandNames"
                                    :key="name"
                                >
                                    {{ name }}
                                </a-select-option>
                            </template>
                        </a-auto-complete>
                    </a-form-item>
                    <div class="mc-operation-reset">
                        <a @click="resetFiltering">{{
                            $t('operation.reset')
                        }}</a>
                    </div>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-empty v-if="!brands.length" />
        <a-list v-else :grid="{ gutter: 5, column: 2 }" :data-source="brands">
            <a-list-item slot="renderItem" slot-scope="brand">
                <a-card hoverable :title="brand.name">
                    <img
                        class="mc-item-image"
                        slot="cover"
                        alt="Brand image"
                        :src="
                            brand.imageLink ||
                                require('@/assets/image/no-img.png')
                        "
                        @click="
                            $router.push({
                                name: 'brandShow',
                                params: { id: brand.id }
                            })
                        "
                    />
                    <template slot="actions" class="ant-card-actions">
                        <a-popconfirm
                            v-if="brand.isDeleted"
                            @confirm="() => onRestoration(brand.id)"
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
                            @confirm="() => onDelete(brand.id)"
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
import { Brand } from '@/store/brand/type';
import { textIncludes } from '@/util/text';

@Component
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

    filteringBrandName: string = '';

    filteringBrandNames: string[] = [];

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
        const brands = this.$store.getters['brand/brands'];
        const trimValue = this.filteringBrandName.trim();

        if (trimValue) {
            return brands.filter((brand) =>
                textIncludes(brand.name, trimValue)
            );
        }
        return brands;
    }

    resetFiltering() {
        this.filteringBrandName = '';
    }

    onChangeFilteringBrandName(value: string) {
        const brands = this.$store.getters['brand/brands'];
        const brandNames = brands.map((brand) => brand.name);
        const trimValue = value.trim();
        if (trimValue) {
            this.filteringBrandNames = brandNames.filter((name) =>
                textIncludes(name, trimValue)
            );
            return;
        }
        this.filteringBrandNames = [];
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
.brand-list-item {
    padding: 13px;
}

.detail {
    margin-top: 10px;
    margin-left: 15px;
}
</style>
