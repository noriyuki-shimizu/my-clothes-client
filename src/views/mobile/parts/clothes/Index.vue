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
                        <clothes-detail
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

import ClothesDetail from '@/components/clothes/Detail.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Clothes } from '@/store/clothes/type';

@Component({
    components: {
        ClothesDetail
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

    get clohtes(): Clothes[] {
        return this.$store.getters['clothes/clothes'];
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
