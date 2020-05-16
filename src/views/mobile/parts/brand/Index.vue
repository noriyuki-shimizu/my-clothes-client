<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'mobileBrandNew'
                    })
                "
            >
                New
            </a-button>
        </div>

        <a-page-header title="Brand" subTitle="item list" />
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
            <a-list-item slot="renderItem" slot-scope="item">
                <div class="mc-item-container">
                    <div>
                        <img
                            class="mc-item-image"
                            :src="
                                item.imageLink ||
                                    require('@/assets/image/no-img.png')
                            "
                        />
                    </div>
                    <div class="detail">
                        <brand-detail
                            :item="item"
                            v-on:set-loading="setLoading"
                            v-on:set-message="setMessage"
                        />
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

import BrandDetail from '@/components/brand/Detail.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Brand } from '@/store/brand/type';

@Component({
    components: {
        BrandDetail
    }
})
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message = resetMessage();

    created() {
        this.fetchBrans();
    }

    private async fetchBrans() {
        this.loading = true;

        this.message = resetMessage();
        await this.$store.dispatch('brand/fetchBrands').catch(this.onError);

        this.loading = false;
    }

    get brands(): Brand[] {
        return this.$store.getters['brand/brands'];
    }

    @Emit('set-loading')
    setLoading(loading: boolean) {
        this.loading = loading;
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
.detail {
    margin-top: 10px;
    margin-left: 15px;
}
</style>
