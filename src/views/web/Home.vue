<template>
    <div id="home-title">
        <img class="icon" :src="require('@/assets/image/icon.png')" />
        <a-carousel autoplay>
            <div v-if="!imageAddresses.length" class="loading-image-address">
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
                        require(`@/assets/image/street-fashion-snap/${imageAddress}`)
                    "
                />
            </div>
        </a-carousel>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { getSeason } from '@/util/date';

const now = new Date();

@Component
export default class Home extends Vue {
    $store!: Vuex.ExStore;

    imageAddresses = [...Array(10)].map(
        (_, i) => `${getSeason(now)}/${i + 1}.jpg`
    );
}
</script>
<style scoped>
#home-title {
    text-align: center;
}

.icon {
    width: 360px;
    padding: 24px 0;
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
