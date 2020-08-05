<template>
    <div class="total-price">
        <a-page-header :title="$t('title.price-chart')" />
        <a-divider class="c-pipe" />

        <a-alert
            class="c-alert-message"
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
import { Component, Vue, Emit, Watch } from 'vue-property-decorator';
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

    @Watch('$i18n.locale')
    onLocalChange() {
        this.message = resetMessage();
    }

    chartOptions: Chart.ChartOptions = {
        legend: {
            labels: {
                boxWidth: 30,
                fontSize: 50
            }
        },
        tooltips: {
            bodyFontSize: 50
        }
    };

    @Emit('on-error')
    onError(err: any) {
        this.message = resetMessage();
        const { $t } = this;
        handleForbiddenError(err, $t.bind(this), this.$store, this.$router);

        const { data } = err.response;
        this.message = {
            isShow: true,
            text: this.$t('status.error').toString(),
            description: this.$t(data).toString(),
            type: 'error'
        };
    }
}
</script>

<style>
.empty-data {
    padding: 24vh 0;
}

#pie-chart {
    height: 60vh !important;
    width: 35vw !important;
    margin-left: auto;
    margin-right: auto;
}
</style>
