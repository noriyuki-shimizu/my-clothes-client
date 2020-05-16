<template>
    <div>
        <div>Name ... {{ item.name }}</div>
        <div>Link ... <a :href="item.link" target="_blank">open</a></div>
        <div>Country ... {{ item.country }}</div>
        <div>
            <a
                @click="
                    $router.push({
                        name: 'mobileBrandEdit',
                        params: { id: item.id }
                    })
                "
            >
                <a-icon type="edit" />
                edit
            </a>
        </div>
        <a>
            <a-popconfirm
                v-if="item.isDeleted"
                @confirm="() => onRestoration(item.id)"
                title="Are you sure restoration this brand?"
                placement="topRight"
                okText="Yes"
                cancelText="No"
            >
                <a-icon type="undo" />
                restoration
            </a-popconfirm>
            <a-popconfirm
                v-else
                title="Are you sure delete this brand?"
                @confirm="() => onDelete(item.id)"
                placement="topRight"
                okText="Yes"
                cancelText="No"
            >
                <a-icon type="delete" />
                delete
            </a-popconfirm>
        </a>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';

import { Brand } from '@/store/brand/type';

@Component
export default class Detail extends Vue {
    $store!: Vuex.ExStore;

    @Prop({ type: Object as () => Brand })
    item!: Brand;

    async onDelete(id: number) {
        this.$emit<boolean>('set-loading', true);
        this.$emit('set-message');

        await this.$store
            .dispatch('brand/onDeleteBrand', id)
            .catch((err: any) => this.$emit('on-error', err));

        this.$emit<boolean>('set-loading', false);
    }

    async onRestoration(id: number) {
        this.$emit<boolean>('set-loading', true);
        this.$emit('set-message');

        await this.$store
            .dispatch('brand/onRestorationBrand', id)
            .catch((err: any) => this.$emit('on-error', err));

        this.$emit<boolean>('set-loading', false);
    }
}
</script>
