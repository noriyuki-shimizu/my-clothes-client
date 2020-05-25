<template>
    <div>
        <div class="mc-button-field">
            <a-button
                type="primary"
                icon="edit"
                @click="
                    $router.push({
                        name: 'mobileGenreEdit',
                        params: { id: genre.id }
                    })
                "
            >
                Edit
            </a-button>
        </div>

        <a-page-header title="Genre" subTitle="show item" />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
        />

        <h3 class="mc-show-item-title">Name</h3>
        <a-list>
            <a-list-item>
                <div>{{ genre.name }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">Color</h3>
        <a-list>
            <a-list-item>
                <a-tag :color="genre.color">
                    {{ genre.color }}
                </a-tag>
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

@Component
export default class Show extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    created() {
        const { id } = this.$route.params;

        if (!id) {
            this.$router.push({ name: 'mobileGenre' });
            return;
        }

        this.$store
            .dispatch('genre/fetchGenre', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('genre/resetGenre');
    }

    get genre() {
        return this.$store.getters['genre/genre'];
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
