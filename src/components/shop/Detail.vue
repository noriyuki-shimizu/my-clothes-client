<template>
    <div>
        <business-status :isBusinessStatus="item.isBusinessStatus" />

        <div>{{ $t('dictionary.shop.name') }} ... {{ item.name }}</div>

        <div>
            {{ $t('dictionary.link') }} ...
            <a v-if="item.link" :href="item.link" target="_blank">
                {{ $t('message.info.go-site') }}
            </a>
            <span v-else>
                {{ $t('message.info.not-link') }}
            </span>
        </div>

        <div>
            {{ $t('dictionary.shop.station-name') }} ... {{ item.stationName }}
        </div>

        <div>{{ $t('dictionary.shop.address') }} ... {{ item.address }}</div>

        <div>
            {{ $t('dictionary.shop.business-hours') }} ...
            {{ item.businessHours }}
        </div>

        <div>{{ $t('dictionary.shop.tel') }} ... {{ item.tel }}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Shop } from '@/store/shop/type';
import BusinessStatus from './BusinessStatus.vue';

@Component({
    components: {
        BusinessStatus
    }
})
export default class Detail extends Vue {
    @Prop({ type: Object as () => Shop })
    item!: Shop;

    get businessStatus() {
        if (!this.item) {
            return 'default';
        }
        return this.item.isBusinessStatus ? 'processing' : 'default';
    }

    get businessStatusText() {
        if (!this.item) {
            return this.$t('status.shop.close');
        }
        return this.item.isBusinessStatus
            ? this.$t('status.shop.open')
            : this.$t('status.shop.close');
    }
}
</script>
