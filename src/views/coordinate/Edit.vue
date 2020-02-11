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
            v-on:onRegister="onRegister"
            v-on:onError="onError"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import { AppMessage } from 'ant-design-vue/types/message';

import CoordinateForm from '@/components/coordinate/Form.vue';
import { isAxiosError } from '@/plugins/api';
import { resetMessage } from '@/util/reset';
import { FormFields } from '@/components/coordinate/form';

@Component({
    components: {
        CoordinateForm
    }
})
export default class Edit extends Vue {
    $store!: Vuex.ExStore;

    message: AppMessage = resetMessage();

    get target() {
        const coordinates = this.$store.getters['coordinate/coordinates'];
        return coordinates.find(
            coordinate => Number(this.$route.params.id) === coordinate.id
        );
    }

    @Emit('onRegister')
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

    @Emit('onError')
    onError(err: any) {
        if (isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                const { $store, $router } = this;
                this.$warning({
                    title: 'Certification expired',
                    content: 'Please sign in again.',
                    onOk: () => {
                        $store.dispatch('user/signOut');
                        $router.push({
                            name: 'signIn',
                            params: { again: 'again' }
                        });
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
}
</script>
<style>
.alert-message {
    margin-bottom: 20px;
}
</style>
