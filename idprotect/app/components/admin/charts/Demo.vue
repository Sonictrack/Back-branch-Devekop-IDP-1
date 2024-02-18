<template>
    <div>
        <b-card
        title="Stats"
        class="mb-2"
        style="max-width: 40rem;"
        >
            <VueApexCharts width="500" type="bar" :options="options" :series="series"></VueApexCharts>
        </b-card>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
    name: "Demo",
    components: { VueApexCharts },
    data() {
        return {
        options: {
            chart: {
            id: 'vuechart-example'
            },
            xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
        },
        series: [{
            name: 'series-1',
            data: [30, 40, 45, 50, 49, 60, 70, 91]
        }]
        }
    }
}
</script>