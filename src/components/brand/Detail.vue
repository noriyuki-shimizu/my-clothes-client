<template>
    <div>
        <div>{{ $t('dictionary.brand.name') }} ... {{ item.name }}</div>
        <div>
            {{ $t('dictionary.link') }} ...
            <a v-if="item.link" :href="item.link" target="_blank">
                {{ $t('message.info.go-site') }}
            </a>
            <span v-else>
                {{ $t('message.info.not-link') }}
            </span>
        </div>
        <div>{{ $t('dictionary.brand.country') }} ... {{ item.country }}</div>
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
