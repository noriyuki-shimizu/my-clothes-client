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

        <brand-table v-on:onError="onError" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import BrandTable from '@/components/brand/Table.vue';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/components/errorHandle';

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

#operation_field {
    position: absolute;
    left: 0;
    width: 100%;
    padding-right: 60px;
    text-align: right;
}
</style>
