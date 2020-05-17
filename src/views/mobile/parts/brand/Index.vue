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
                            @click="
                                $router.push({
                                    name: 'mobileBrandShow',
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
                                title="Are you sure restoration this brand?"
                                placement="topRight"
                                okText="Yes"
                                cancelText="No"
                            >
                                <a-icon type="undo" />
                                restoration
                            </a-popconfirm>
                            <a-popconfirm
                                v-else
                                title="Are you sure delete this brand?"
                                @confirm="() => onDelete(item.id)"
                                placement="topRight"
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
