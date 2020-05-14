<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'mobileCoordinateNew'
                    })
                "
                >New</a-button
            >
        </div>

        <a-empty v-if="!coordinates.length" />
        <a-row v-else>
            <a-alert
                class="alert-message"
                v-if="message.isShow"
                :message="message.text"
                :description="message.description"
                :type="message.type"
            />
            <a-col
                :span="12"
                v-for="(coordinate, index) in coordinates"
                :key="index"
                @click="
                    $router.push({
                        name: 'mobileCoordinateShow',
                        params: { id: coordinate.id }
                    })
                "
            >
                <a-card hoverable class="coordinate-item">
                    <img
                        alt="example"
                        :src="coordinate.imageLink"
                        slot="cover"
                    />
                    <a-card-meta :title="coordinate.season" />
                </a-card>
            </a-col>
        </a-row>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';
import { Coordinate } from '@/store/coordinate/type';

@Component
export default class Index extends Vue {
    $store!: Vuex.ExStore;

    loading = false;

    message: AppMessage = resetMessage();

    created() {
        this.fetchCoordinates();
    }

    private async fetchCoordinates() {
        this.loading = true;
        await this.$store
            .dispatch('coordinate/fetchCoordinates')
            .catch(this.onError);
        this.loading = false;
    }

    get coordinates(): Coordinate[] {
        return this.$store.getters['coordinate/coordinates'];
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
.button-field {
    padding-bottom: 20px;
}

.coordinate-item {
    width: 43vw;
}
</style>
