<template>
    <div>
        <div id="operation_field">
            <a-button
                type="primary"
                icon="file-add"
                size="large"
                @click="onNew"
                :disabled="RegistrationNum > 20"
            >
                New
            </a-button>
        </div>
        <h1>Genre</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <genre-table v-on:on-error="onError" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { AppMessage } from 'ant-design-vue/types/message';
import * as Vuex from 'vuex';

import GenreTable from '@/components/genre/Table.vue';
import { resetMessage } from '@/util/reset';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        GenreTable
    }
})
export default class Genre extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    get RegistrationNum() {
        return this.$store.getters['genre/genres'].length;
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
        this.$router.push({ name: 'genreNew' });
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
