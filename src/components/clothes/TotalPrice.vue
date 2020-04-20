<template>
    <a-statistic
        title="Total price"
        :value="totalPrice"
        class="field-total-price"
    />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';

@Component
export default class TotalPrice extends Vue {
    $store!: Vuex.ExStore;

    created() {
        this.$store
            .dispatch('clothes/fetchTotalPrice')
            .catch((err: any) => this.$emit('on-error', err));
    }

    get totalPrice() {
        return this.$store.getters['clothes/totalPrice'];
    }
}
</script>

<style scoped>
.field-total-price {
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    text-align: right;
}
</style>
