<template>
    <a-spin :spinning="loading" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                @click="
                    $router.push({
                        name: 'coordinateNew'
                    })
                "
            >
                {{ $t('operation.new') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="`${$t('title.coordinate')} (${coordinates.length})`"
            :subTitle="$t('title.sub-title.item-list')"
        />
        <a-divider class="c-pipe" />

        <a-empty v-if="!coordinates.length" />
        <a-row v-else>
            <a-alert
                class="c-alert-message"
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
                        name: 'coordinateShow',
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
                    <a-card-meta :title="$t(coordinate.season)" />
                </a-card>
            </a-col>
        </a-row>
    </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
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

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

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
        const { $t } = this;
        handleForbiddenError(err, $t.bind(this), this.$store, this.$router);

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
.coordinate-item {
    width: 43vw;
}
</style>
