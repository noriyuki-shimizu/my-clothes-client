<template>
    <div>
        <h1>Brand</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />
        <div id="operation_field">
            <a-button
                type="primary"
                icon="file-add"
                size="large"
                @click="onNew"
            >
                New
            </a-button>
        </div>

        <brand-table v-on:onError="onError" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { isAxiosError } from '@/plugins/api';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import BrandTable from '@/components/brand/Table.vue';
import { Record } from '@/components/brand/table';
import { resetMessage } from '@/util/reset';

@Component({
    components: {
        BrandTable
    }
})
export default class Brand extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    @Emit('onError')
    onError(err: any) {
        this.message = resetMessage();
        if (isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                const { $store, $router } = this;
                this.$warning({
                    title: 'Certification expired',
                    content: 'Please sign in again.',
                    onOk: () => {
                        $store.dispatch('user/signOut');
                        $router.push({ name: 'signIn' });
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
    }

    onNew() {
        this.$router.push({ name: 'brandNew' });
    }
}
</script>
<style scoped>
.alert-message {
    margin-bottom: 20px;
}

#operation_field {
    padding-bottom: 20px;
}
</style>
