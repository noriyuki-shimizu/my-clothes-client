<template>
    <div>
        <div class="mc-button-field">
            <a-button
                type="primary"
                icon="edit"
                @click="
                    $router.push({
                        name: 'mobileCoordinateEdit',
                        params: { id: coordinate.id }
                    })
                "
            >
                Edit
            </a-button>
        </div>

        <a-page-header title="Coordinate" subTitle="show item" />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <h3 class="mc-show-item-title">Season</h3>
        <a-list>
            <a-list-item>
                <div>{{ coordinate.season }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Coordinate</h3>
        <a-list>
            <a-list-item>
                <div>
                    <img
                        class="mc-show-item-image"
                        :src="coordinate.imageLink"
                    />
                </div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Coordinate item</h3>
        <a-list bordered :data-source="coordinate.usedCoordinates">
            <a-list-item slot="renderItem" slot-scope="item">
                <div class="mc-item-container">
                    <div>
                        <img class="mc-item-image" :src="item.imageLink" />
                    </div>
                    <div class="detail">
                        <clothes-detail :item="item" />
                    </div>
                </div>
            </a-list-item>
        </a-list>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { Record } from '@/components/coordinate/type';
import ClothesDetail from '@/components/clothes/Detail.vue';
import { resetMessage } from '@/util/message';
import { AppMessage } from 'ant-design-vue/types/message';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        ClothesDetail
    }
})
export default class Show extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileCoordinate' });
        }

        this.$store
            .dispatch('coordinate/fetchCoordinate', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('coordinate/resetCoordinate');
    }

    get coordinate() {
        return this.$store.getters['coordinate/coordinate'];
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
