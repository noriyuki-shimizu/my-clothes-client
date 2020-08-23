<template>
    <a-spin :spinning="false" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                icon="edit"
                @click="
                    $router.push({
                        name: 'shopEdit',
                        params: { id: shop.id }
                    })
                "
            >
                {{ $t('operation.edit') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="$t('title.shop')"
            :subTitle="$t('title.sub-title.show-item')"
        />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.shop.business-status') }}
        </h3>
        <a-list>
            <a-list-item>
                <business-status :isBusinessStatus="shop.isBusinessStatus" />
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.shop.name') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ shop.name }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.image') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>
                    <img
                        class="mc-show-item-image"
                        :src="
                            shop.imageLink ||
                                require('@/assets/image/no-img.png')
                        "
                    />
                </div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.link') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ shop.link || $t('message.info.not-link') }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.shop.station-name') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ shop.stationName }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.shop.address') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ shop.address }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.shop.business-hours') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ shop.businessHours }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.shop.tel') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ shop.tel }}</div>
            </a-list-item>
        </a-list>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { resetMessage } from '@/util/message';
import { AppMessage } from 'ant-design-vue/types/message';
import { handleForbiddenError } from '@/util/errorHandle';
import BusinessStatus from '@/components/shop/BusinessStatus.vue';

@Component({
    components: {
        BusinessStatus
    }
})
export default class Show extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'shop' });
            return;
        }

        this.$store.dispatch('shop/fetchShop', Number(id)).catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('shop/resetShop');
    }

    get shop() {
        return this.$store.getters['shop/shop'];
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
.ant-list-item {
    padding: 15px;
}

.detail {
    font-size: 12px;
    margin-left: 15px;
}
</style>
