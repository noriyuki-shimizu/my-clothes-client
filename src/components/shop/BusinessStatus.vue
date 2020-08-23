<template>
    <div>
        <a-badge :status="businessStatus" :text="businessStatusText" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BusinessStatus extends Vue {
    @Prop({ type: Boolean })
    isBusinessStatus!: boolean;

    get businessStatus() {
        return this.isBusinessStatus ? 'processing' : 'default';
    }

    get businessStatusText() {
        return this.isBusinessStatus
            ? this.$t('status.shop.open')
            : this.$t('status.shop.close');
    }
}
</script>
