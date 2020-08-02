<template>
    <a-empty class="empty-data" v-if="!totalPricePerGenres.length" />
    <pie-chart v-else :chartData="chartData" :chartOptions="chartOptions" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import PieChart from '@/components/chart/PieChart';
import { TotalPricePerGenreData } from '@/store/genre/type';

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
export default class TotalPricePerGenre extends Vue {
    @Prop({ type: Object as () => Chart.ChartOptions, required: true })
    chartOptions!: Chart.ChartOptions;

    $store!: Vuex.ExStore;

    created() {
        this.$store
            .dispatch('genre/fetchTotalPricePerGenres')
            .catch((err: any) => this.$emit('on-error', err));
    }

    get totalPricePerGenres() {
        return this.$store.getters['genre/totalPricePerGenres'];
    }

    get chartData() {
        const {
            labels,
            backgroundColor,
            data
        } = this.totalPricePerGenres.reduce(
            (
                accumulator: ChartDataParts,
                currentValue: TotalPricePerGenreData
            ) => {
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
}
</script>

<style>
.empty-data {
    padding: 24vh 0;
}
</style>
