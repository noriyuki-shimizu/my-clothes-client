<template>
    <div>
        <h1>Update coordinate</h1>
        <a-divider />
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <coordinate-form
            :target="target"
            v-on:on-register="onRegister"
            v-on:on-error="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import CoordinateForm from '@/components/coordinate/Form.vue';
import { resetMessage } from '@/util/reset';
import { FormFields } from '@/components/coordinate/type';
import { handleForbiddenError } from '@/components/errorHandle';

@Component({
    components: {
        CoordinateForm
    }
})
export default class Edit extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    created() {
        if (!this.target) {
            this.$router.push({ name: 'coordinate' });
        }
    }

    get target() {
        const coordinates = this.$store.getters['coordinate/coordinates'];
        return coordinates.find(
            coordinate => Number(this.$route.params.id) === coordinate.id
        );
    }

    @Emit('on-register')
    async onRegister(values: FormFields) {
        const { target } = this;
        if (!target) {
            this.$router.push({ name: 'coordinate' });
            return;
        }

        const { season, clothingIds, image } = values;
        const imageFile = image && image.file ? image.file.originFileObj : null;

        await this.$store.dispatch('coordinate/onUpdateCoordinate', {
            id: target.id,
            coordinate: {
                season,
                imageId: target.imageId,
                imageLink: target.imageLink,
                clothingIds
            },
            imageFile
        });

        this.$success({
            title: 'Create success 👏',
            onOk: () => {
                this.$router.push({ name: 'coordinate' });
            }
        });
    }

    onResetMessage() {
        this.message = resetMessage();
    }

    @Emit('on-error')
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
}
</script>
<style>
.alert-message {
    margin-bottom: 20px;
}
</style>
