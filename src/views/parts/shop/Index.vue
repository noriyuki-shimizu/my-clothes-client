<template>
    <div>
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
        <h1>Shop</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <shop-table
            v-on:onError="onError"
            v-on:onResetMessage="onResetMessage"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import ShopTable from '@/components/shop/Table.vue';
import { Record } from '@/components/shop/table';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '../../../components/errorHandle';

@Component({
    components: {
        ShopTable
    }
})
export default class Shop extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    @Emit('onResetMessage')
    onResetMessage() {
        this.message = resetMessage();
    }

    @Emit('onError')
    onError(err: any) {
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
        this.$router.push({ name: 'shopNew' });
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

#operation_field {
    position: absolute;
    left: 0;
    width: 100%;
    padding-right: 60px;
    text-align: right;
}
</style>
