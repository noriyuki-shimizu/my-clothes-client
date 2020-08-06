<template>
    <a-spin :spinning="false" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                icon="edit"
                @click="
                    $router.push({
                        name: 'clothesEdit',
                        params: { id: clothes.id }
                    })
                "
            >
                {{ $t('operation.edit') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="$t('title.clothes')"
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
            {{ $t('dictionary.image') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>
                    <img class="mc-show-item-image" :src="clothes.imageLink" />
                </div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.brand.index') }}
        </h3>
        <a-list>
            <a-list-item>
                <a
                    @click="
                        $router.push({
                            name: 'brandShow',
                            params: { id: clothes.brand.id }
                        })
                    "
                >
                    {{ clothes.brand.name }}
                </a>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.shop.index') }}
        </h3>
        <a-list>
            <a-list-item>
                <a
                    @click="
                        $router.push({
                            name: 'shopShow',
                            params: { id: clothes.shop.id }
                        })
                    "
                    >{{ clothes.shop.name }}</a
                >
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.genre.index') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>
                    <a-tag
                        v-for="(genre, index) in clothes.genres"
                        :key="index"
                        :color="genre.color"
                        @click="
                            $router.push({
                                name: 'genreShow',
                                params: { id: genre.id }
                            })
                        "
                    >
                        {{ genre.name }}
                    </a-tag>
                </div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.price') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ clothes.price | priceFormat }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.clothes.buy-date') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ clothes.buyDate }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.comment') }}
        </h3>
        <a-list>
            <a-list-item>
                <p>{{ clothes.comment }}</p>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.clothes.satisfaction') }}
        </h3>
        <a-list>
            <a-list-item>
                <a-rate :value="clothes.satisfaction" disabled allow-half />
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
import { priceFormat } from '@/filters/number-format';

@Component({
    filters: {
        priceFormat
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
            this.$router.push({ name: 'clothes' });
            return;
        }

        this.$store
            .dispatch('clothes/fetchOne', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('clothes/resetItem');
    }

    get clothes() {
        return this.$store.getters['clothes/item'];
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
