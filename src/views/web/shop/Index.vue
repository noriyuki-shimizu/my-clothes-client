<template>
    <div>
        <a-page-header title="Shop" subTitle="item list">
            <template slot="extra">
                <a-button
                    type="primary"
                    icon="reload"
                    key="2"
                    :loading="loading"
                    @click="reloadShops"
                >
                    Reload list
                </a-button>
                <a-button type="primary" icon="file-add" key="1" @click="onNew">
                    New
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

        <p>total item: {{ shops.length }}</p>
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
import { Vue, Component, Emit } from 'vue-property-decorator';
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
        handleForbiddenError(err, this.$store, this.$router);

        this.message = {
            isShow: true,
            text: `Error (${err.message})`,
            description: err.response
                ? err.response.data
                : `Access URL: ${err.config.url}`,
            type: 'error'
        };
    }

    onNew() {
        this.$router.push({ name: 'shopNew' });
    }
}
</script>