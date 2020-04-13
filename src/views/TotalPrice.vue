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
        <a-empty class="empty-data" v-if="!totalPricePerGenres.length" />
        <pie-chart v-else :chartData="chartData" :chartOptions="chartOptions" />

        <a-divider />

        <a-statistic
            title="Total price"
            :value="totalPrice"
            class="field-total-price"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import Chart from 'chart.js';
import PieChart from '@/components/maps/PieChart';

import { resetMessage } from '@/util/message';
import { handleForbiddenError } from '@/util/errorHandle';

type ChartDataParts = {
    labels: string[];
    backgroundColor: string[];
    data: number[];
};

@Component({
    components: {
        PieChart
    }
})
export default class TotalPrice extends Vue {
    $store!: Vuex.ExStore;

    message = resetMessage();

    async created() {
        await this.$store
            .dispatch('genre/fetchTotalPricePerGenres')
            .catch(this.onError);
    }

    get totalPricePerGenres() {
        return this.$store.getters['genre/totalPricePerGenres'];
    }

    get totalPrice() {
        return this.totalPricePerGenres.reduce(
            (accumulator, { totalPrice }) => accumulator + totalPrice,
            0
        );
    }

    get chartData() {
        const {
            labels,
            backgroundColor,
            data
        } = this.totalPricePerGenres.reduce(
            (accumulator: ChartDataParts, currentValue) => {
                accumulator.labels.push(currentValue.name);
                accumulator.backgroundColor.push(currentValue.color);
                accumulator.data.push(currentValue.totalPrice);
                return accumulator;
            },
            { labels: [], backgroundColor: [], data: [] }
        );
        return {
            labels,
            datasets: [
                {
                    backgroundColor,
                    data
                }
            ]
        };
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
