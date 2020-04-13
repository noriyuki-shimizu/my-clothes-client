<template>
    <div>
        <a-page-header title="Brand" subTitle="item list">
            <template slot="extra">
                <a-button
                    type="primary"
                    icon="reload"
                    key="2"
                    :loading="loading"
                    @click="reloadBrand"
                >
                    Reload list
                </a-button>
                <a-button type="primary" icon="file-add" key="1" @click="onNew">
                    New
                </a-button>
            </template>
        </a-page-header>
        <a-divider class="pipe" />

        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <p>total item: {{ brands.length }}</p>
        <brand-table
            :brands="brands"
            :loading="loading"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
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

    async created() {
        if (!this.brands.length) {
            this.fetchBrands();
        }
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

    @Emit('on-error')
    onError(err: any) {
        this.message = resetMessage();
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
        this.$router.push({ name: 'brandNew' });
    }
}
</script>
<style scoped>
.alert-message {
    margin-bottom: 20px;
}
</style>
