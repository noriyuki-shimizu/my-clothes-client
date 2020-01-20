<template>
    <div class="total-price">
        <pie-chart :chartData="chartData" :chartOptions="chartOptions" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Chart from 'chart.js';
import PieChart from '@/components/maps/PieChart';

@Component({
    components: {
        PieChart
    }
})
export default class TotalPrice extends Vue {
    private totalPricePerGenreList: any[] = [
        {
            genre: 'Tops',
            totalPrice: 10000
        },
        {
            genre: 'Tee',
            totalPrice: 10000
        },
        {
            genre: 'Outer',
            totalPrice: 10000
        },
        {
            genre: 'Bottoms',
            totalPrice: 10000
        },
        {
            genre: 'Hat',
            totalPrice: 10000
        }
    ];

    private chartData: Chart.ChartData = {
        labels: [
            'Tops',
            'Tee',
            'Outer',
            'Bottoms',
            'Hat',
            'Bag',
            'Accessories',
            'Shoes & Boots'
        ],
        datasets: [
            {
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#95a5a6',
                    '#9b59b6',
                    '#f1c40f',
                    '#e74c3c',
                    '#34495e',
                    '#e4495e'
                ],
                data: [12, 19, 3, 17, 28, 24, 7, 10]
            }
        ]
    };

    private chartOptions: Chart.ChartOptions = {
        legend: {
            labels: {
                boxWidth: 30,
                fontSize: 50
            }
        },
        tooltips: {
            bodyFontSize: 30
        }
    };
}
</script>

<style>
#pie-chart {
    height: 70vh !important;
    width: 40vw !important;
    margin-left: auto;
    margin-right: auto;
}
</style>
