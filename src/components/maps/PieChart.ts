import { Component, Mixins, Prop } from 'vue-property-decorator';
import Chart from 'chart.js';
import { Pie, mixins } from 'vue-chartjs';

@Component({})
export default class PieChart extends Mixins(Pie, mixins.reactiveProp) {
    @Prop() public chartData!: Chart.ChartData;

    @Prop() public chartOptions!: Chart.ChartOptions;

    public mounted() {
        this.renderChart(this.chartData, this.chartOptions);
    }
}
