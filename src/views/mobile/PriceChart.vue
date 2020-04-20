<template>
    <div class="total-price">
        <a-alert
            class="alert-message"
            v-if="message.isShow"
            :message="message.text"
            :description="message.description"
            :type="message.type"
            showIcon
        />

        <total-price-per-genre
            :chartOptions="chartOptions"
            v-on:on-error="onError"
        />

        <a-divider />

        <total-price />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import Chart from 'chart.js';
import TotalPricePerGenre from '@/components/chart/TotalPricePerGenre.vue';
import TotalPrice from '@/components/clothes/TotalPrice.vue';

import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';

@Component({
    components: {
        TotalPricePerGenre,
        TotalPrice
    }
})
export default class PriceChart extends Vue {
    $store!: Vuex.ExStore;

    message = resetMessage();

    chartOptions: Chart.ChartOptions = {
        legend: {
            labels: {
                boxWidth: 20,
                fontSize: 15
            }
        },
        tooltips: {
            bodyFontSize: 15
        }
    };

    @Emit('on-error')
    onError(err: any) {
        this.message = resetMessage();
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
.field-total-price {
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    text-align: right;
}
</style>
