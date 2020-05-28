<template>
    <div>
        <div class="mc-button-field">
            <a-button
                type="primary"
                icon="edit"
                @click="
                    $router.push({
                        name: 'mobileClothesEdit',
                        params: { id: clothes.id }
                    })
                "
            >
                Edit
            </a-button>
        </div>

        <a-page-header title="Clothes" subTitle="show item" />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <h3 class="mc-show-item-title">Image</h3>
        <a-list>
            <a-list-item>
                <div>
                    <img class="mc-show-item-image" :src="clothes.imageLink" />
                </div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Brand</h3>
        <a-list>
            <a-list-item>
                <a
                    @click="
                        $router.push({
                            name: 'mobileBrandShow',
                            params: { id: clothes.brand.id }
                        })
                    "
                >
                    {{ clothes.brand.name }}
                </a>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Shop</h3>
        <a-list>
            <a-list-item>
                <a
                    @click="
                        $router.push({
                            name: 'mobileShopShow',
                            params: { id: clothes.shop.id }
                        })
                    "
                    >{{ clothes.shop.name }}</a
                >
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Genres</h3>
        <a-list>
            <a-list-item>
                <div>
                    <a-tag
                        v-for="(genre, index) in clothes.genres"
                        :key="index"
                        :color="genre.color"
                        @click="
                            $router.push({
                                name: 'mobileGenreShow',
                                params: { id: genre.id }
                            })
                        "
                    >
                        {{ genre.name }}
                    </a-tag>
                </div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Price</h3>
        <a-list>
            <a-list-item>
                <div>{{ clothes.price | priceFormat }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Buy date</h3>
        <a-list>
            <a-list-item>
                <div>{{ clothes.buyDate }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Comment</h3>
        <a-list>
            <a-list-item>
                <p>{{ clothes.comment }}</p>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Satisfaction</h3>
        <a-list>
            <a-list-item>
                <a-rate :value="clothes.satisfaction" disabled allow-half />
            </a-list-item>
        </a-list>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
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

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileClothes' });
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

        this.message = {
            isShow: true,
            text: `Error (${err.message})`,
            description: err.response
                ? err.response.data
                : `Access URL: ${err.config.url}`,
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
