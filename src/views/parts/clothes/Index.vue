<template>
    <div>
        <div id="operation_field">
            <a-button
                class="reload-button"
                type="primary"
                size="large"
                icon="reload"
                :loading="loading"
                @click="reloadClothes"
            >
                Reload list
            </a-button>

            <a-button
                type="primary"
                icon="file-add"
                size="large"
                @click="onNew"
            >
                New
            </a-button>
        </div>
        <h1>Clothes</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <p>total item: {{ clothes.length }}</p>
        <clothes-table
            :clothes="clothes"
            :loading="loading"
            v-on:on-error="onError"
            v-on:on-reset-message="onResetMessage"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import ClothesTable from '@/components/clothes/Table.vue';
import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';

type ClothesDispatches =
    | 'clothes/fetchClothes'
    | 'clothes/fetchAssistGenres'
    | 'clothes/fetchAssistBrands'
    | 'clothes/fetchAssistShops';

@Component({
    components: {
        ClothesTable
    }
})
export default class Shop extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    loading = false;

    created() {
        this.$emit('on-reset-message');

        const despatches: ClothesDispatches[] = [
            'clothes/fetchAssistGenres',
            'clothes/fetchAssistBrands',
            'clothes/fetchAssistShops'
        ];

        if (!this.clothes.length) {
            despatches.push('clothes/fetchClothes');
        }

        this.fetchClothes(despatches);
    }

    reloadClothes() {
        this.$store.commit('clothes/clothesStateChange', []);

        const despatches: ClothesDispatches[] = [
            'clothes/fetchAssistGenres',
            'clothes/fetchAssistBrands',
            'clothes/fetchAssistShops',
            'clothes/fetchClothes'
        ];

        this.fetchClothes(despatches);
    }

    private async fetchClothes(despatches: ClothesDispatches[]) {
        this.loading = true;

        await Promise.all(
            despatches.map(despatch => this.$store.dispatch(despatch))
        ).catch(err => {
            this.$emit('on-error', err);
        });

        this.loading = false;
    }

    get clothes() {
        return this.$store.getters['clothes/clothes'];
    }

    @Emit('on-reset-message')
    onResetMessage() {
        this.message = resetMessage();
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

    onNew() {
        this.$router.push({ name: 'clothesNew' });
    }
}
</script>
<style scoped>
.alert-message {
    margin-bottom: 20px;
}

#operation_field {
    position: absolute;
    left: 0;
    width: 100%;
    padding-right: 60px;
    text-align: right;
}

.reload-button {
    margin-right: 20px;
}
</style>
