import { Component, Mixins, Prop } from 'vue-property-decorator';
import Chart from 'chart.js';
import { Pie, mixins } from 'vue-chartjs';

@Component
export default class PieChart extends Mixins(Pie, mixins.reactiveProp) {
    @Prop({ type: Object as () => Chart.ChartData, required: true })
    chartData!: Chart.ChartData;

    @Prop({ type: Object as () => Chart.ChartOptions, required: true })
    chartOptions!: Chart.ChartOptions;

    mounted() {
        this.renderChart(this.chartData, this.chartOptions);
    }
}
