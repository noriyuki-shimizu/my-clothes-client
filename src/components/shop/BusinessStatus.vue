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

    @Prop()
    text?: string;

    get businessStatus() {
        return this.isBusinessStatus ? 'processing' : 'default';
    }

    get businessStatusText() {
        if (this.text || this.text === '') {
            return this.text;
        }
        return this.isBusinessStatus
            ? this.$t('status.shop.open')
            : this.$t('status.shop.close');
    }
}
</script>
