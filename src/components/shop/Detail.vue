<template>
    <div>
        <div>Name ... {{ item.name }}</div>
        <div>
            Link ...
            <a v-if="item.link" :href="item.link" target="_blank">open</a>
            <span v-else>no link</span>
        </div>
        <div>Station name ... {{ item.stationName }}</div>
        <div>Address ... {{ item.address }}</div>
        <div>Business hours ... {{ item.businessHours }}</div>
        <div>Tel ... {{ item.tel }}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Shop } from '@/store/shop/type';

@Component
export default class Detail extends Vue {
    @Prop({ type: Object as () => Shop })
    item!: Shop;
}
</script>
