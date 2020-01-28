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
                    <img class="slide-img" :src="imageAddress" />
                </div>
            </a-carousel>
        </div>
        <a-divider orientation="left">Services information</a-divider>
        <a-timeline>
            <a-timeline-item color="green"
                >Create a services site 2019-12-01</a-timeline-item
            >
            <a-timeline-item color="green"
                >Create a services site ????-??-??</a-timeline-item
            >
            <a-timeline-item color="red">
                <p>Solve initial network problems 1</p>
                <p>Solve initial network problems 2</p>
                <p>Solve initial network problems 3 ????-??-??</p>
            </a-timeline-item>
            <a-timeline-item>
                <p>Technical testing 1</p>
                <p>Technical testing 2</p>
                <p>Technical testing 3 ????-??-??</p>
            </a-timeline-item>
            <a-timeline-item color="green"
                >v1 will be completed 2020-12-01</a-timeline-item
            >
        </a-timeline>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { isAxiosError } from '../plugins/api';
import { AppMessage } from 'ant-design-vue/types/message';
import { resetMessage } from '@/util/reset';

@Component
export default class Home extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    async created() {
        this.message = resetMessage();
        try {
            const imageAddresses = this.imageAddresses;
            if (!(imageAddresses && imageAddresses.length)) {
                await this.$store.dispatch('imageAddress/fetchImageAddresses');
            }
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response && err.response.status === 403) {
                    const { $store, $router } = this;
                    this.$warning({
                        title: 'Certification expired',
                        content: 'Please sign in again.',
                        onOk: () => {
                            $store.dispatch('user/signOut');
                            $router.push({
                                name: 'signIn',
                                params: { again: 'again' }
                            });
                        }
                    });
                    return;
                }

                this.message = {
                    isShow: true,
                    text: `Error (${err.message})`,
                    description: err.response
                        ? err.response.data
                        : `Access URL: ${err.config.url}`,
                    type: 'error'
                };
            }
            console.log('error: ', err);
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
