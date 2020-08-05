<template>
    <div>
        <a-page-header
            :title="`${$t('title.shop')} (${shops.length})`"
            :subTitle="$t('title.sub-title.item-list')"
        >
            <template slot="extra">
                <a-button
                    type="primary"
                    icon="reload"
                    key="2"
                    :loading="loading"
                    @click="reloadShops"
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

        <shop-table
            :shops="shops"
            :loading="loading"
            v-on:on-error="onError"
            v-on:on-reset-message="onResetMessage"
            v-on:set-loading="setLoading"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import ShopTable from '@/components/shop/Table.vue';
import { Record } from '@/components/shop/type';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        ShopTable
    }
})
export default class Shop extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    loading = false;

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        this.onResetMessage();

        this.fetchShops();
    }

    reloadShops() {
        this.$store.commit('shop/shopsStateChange', []);
        this.fetchShops();
    }

    private async fetchShops() {
        this.loading = true;
        await this.$store.dispatch('shop/fetchShops').catch(this.onError);
        this.loading = false;
    }

    get shops() {
        return this.$store.getters['shop/shops'];
    }

    @Emit('on-reset-message')
    onResetMessage() {
        this.message = resetMessage();
    }

    @Emit('set-loading')
    setLoading(loading: boolean) {
        this.loading = loading;
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

    onNew() {
        this.$router.push({ name: 'shopNew' });
    }
}
</script>
