<template>
    <div>
        <a-page-header
            :title="`${$t('title.brand')} (${brands.length})`"
            :subTitle="$t('title.sub-title.item-list')"
        >
            <template slot="extra">
                <a-button
                    type="primary"
                    icon="reload"
                    key="2"
                    :loading="loading"
                    @click="reloadBrand"
                >
                    {{ $t('operation.reload-list') }}
                </a-button>
                <a-button type="primary" icon="file-add" key="1" @click="onNew">
                    {{ $t('operation.new') }}
                </a-button>
            </template>
        </a-page-header>
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <brand-table
            :brands="brands"
            :loading="loading"
            v-on:set-loading="setLoading"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import BrandTable from '@/components/brand/Table.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Record } from '@/components/brand/type';

@Component({
    components: {
        BrandTable
    }
})
export default class Brand extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    loading = false;

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    async created() {
        this.fetchBrands();
    }

    private async fetchBrands() {
        this.loading = true;
        await this.$store
            .dispatch('brand/fetchBrands')
            .catch((err: any) => this.$emit('on-error', err));
        this.loading = false;
    }

    reloadBrand() {
        this.$store.commit('brand/brandsStateChange', []);
        this.fetchBrands();
    }

    get brands() {
        return this.$store.getters['brand/brands'];
    }

    @Emit('set-loading')
    setLoading(loading: boolean) {
        this.loading = loading;
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

    onNew() {
        this.$router.push({ name: 'brandNew' });
    }
}
</script>
