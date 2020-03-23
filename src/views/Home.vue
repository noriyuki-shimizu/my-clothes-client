<template>
    <div>
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <div id="home-title">
            <h1>My Clothes</h1>
            <a-carousel autoplay>
                <div
                    v-if="!imageAddresses.length"
                    class="loading-image-address"
                >
                    <a-spin size="large" />
                </div>
                <div
                    v-else
                    v-for="imageAddress in imageAddresses"
                    :key="imageAddress"
                >
                    <img
                        class="slide-img"
                        :src="
                            require(`@/assets/street-fashion-snap/${imageAddress}`)
                        "
                    />
                </div>
            </a-carousel>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/util/errorHandle';

@Component
export default class Home extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    async created() {
        this.message = resetMessage();
        const { imageAddresses } = this;
        if (!imageAddresses.length) {
            await this.$store
                .dispatch('imageAddress/fetchImageAddresses')
                .catch((err: any) => {
                    handleForbiddenError(err, this.$store, this.$router);

                    this.message = {
                        isShow: true,
                        text: `Error (${err.message})`,
                        description: err.response
                            ? err.response.data
                            : `Access URL: ${err.config.url}`,
                        type: 'error'
                    };
                });
        }
    }

    get imageAddresses() {
        return this.$store.getters['imageAddress/values'];
    }
}
</script>
<style scoped>
.alert-message {
    margin-bottom: 15px;
}

#home-title {
    text-align: center;
}

.loading-image-address {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

.ant-carousel >>> .slick-slider {
    text-align: center;
    height: 60vh;
    line-height: 60vh;
    overflow: hidden;
}

.ant-carousel >>> .slide-img {
    margin: auto;
    height: 60vh;
}
</style>
