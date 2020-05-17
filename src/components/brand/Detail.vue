<template>
    <div>
        <div>Name ... {{ item.name }}</div>
        <div>
            Link ...
            <a v-if="item.link" :href="item.link" target="_blank">open</a>
            <span v-else>no link</span>
        </div>
        <div>Country ... {{ item.country }}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Brand } from '@/store/brand/type';

@Component
export default class Detail extends Vue {
    @Prop({ type: Object as () => Brand })
    item!: Brand;
}
</script>
