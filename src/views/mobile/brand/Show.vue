<template>
    <a-spin :spinning="false" tip="Loading...">
        <div class="mc-button-field">
            <a-button
                type="primary"
                icon="edit"
                @click="
                    $router.push({
                        name: 'brandEdit',
                        params: { id: brand.id }
                    })
                "
            >
                {{ $t('operation.edit') }}
            </a-button>
        </div>

        <a-page-header
            class="mc-page-title"
            :title="$t('title.brand')"
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
            {{ $t('dictionary.brand.name') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ brand.name }}</div>
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
                            brand.imageLink ||
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
                <a v-if="brand.link" :href="brand.link" target="_blank">
                    {{ brand.link }}
                </a>
                <div v-else>{{ $t('message.info.not-link') }}</div>
            </a-list-item>
        </a-list>

        <h3 class="mc-show-item-title">
            {{ $t('dictionary.brand.country') }}
        </h3>
        <a-list>
            <a-list-item>
                <div>{{ brand.country }}</div>
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
import InitiableMixin from '@/mixin/Initiable';

@Component({
    mixins: [InitiableMixin]
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
            this.$router.push({ name: 'brand' });
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        this.$store
            .dispatch('brand/fetchBrand', Number(id))
            .catch(this.onError);
    }

    beforeDestroy() {
        this.$store.commit('brand/resetBrand');
    }

    get brand() {
        return this.$store.getters['brand/brand'];
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
