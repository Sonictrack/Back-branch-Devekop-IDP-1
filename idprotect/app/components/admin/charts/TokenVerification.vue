<template>
    <div>
        <apexchart :options="options" :series="series" v-if="dataLoaded"></apexchart>
    </div>
</template>

<script>
import { stats } from "~/api/stats";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { UserType } from "~/components/enums/userType";
 import { TABLES_NAME } from "~/components/enums/tables";
export default {
    name: "TokenVerification",
    mixins: [mixinMessages, mixinUser], 
    data() {
        return {
            dataLoaded: false, 
            options: {
                    title: {
                        text: 'Nombre de tokens',
                        align: 'left'
                    },
                    chart: {
                        id: 'vuechart-example',
                        dropShadow: {
                            enabled: true,
                            color: '#000',
                            top: 18,
                            left: 7,
                            blur: 10,
                            opacity: 0.2
                        },
                        toolbar: {
                            show: false
                        }
                    },
                    colors: ['#77B6EA'],
                    dataLabels: {
                        enabled: true,
                        },
                        stroke: {
                        curve: 'smooth'
                    },
                    grid: {
                        borderColor: '#e7e7e7',
                        row: {
                            colors: ['#f3f3f3', 'transparent'], 
                            opacity: 0.5
                        },
                    },
                    markers: {
                        size: 1
                    },
                    yaxis: {
                        title: {
                            text: 'Nombre'
                        },
                        min: 0,
                        max: 100
                    },
                    xaxis: {
                        title: {
                            text: 'Mois concernés'
                        },
                        categories: []
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right',
                        floating: true,
                        offsetY: -25,
                        offsetX: -5
                    },
            },
            series: [{
                name: 'Nombre de token crées',
                data: []
            }]      
        }
    },
    mounted() {
        this.onLoadPage();
    },
    methods:{
        async onLoadPage() {
            try {
                const response = await stats(this.$store.state.authentication.type, TABLES_NAME.TOKEN_VERIFICATION);
                const json = await response.json();

                if (json.error) {
                    throw new Error(json.error);
                }

                const values = json.results;

                if(values){
                    values.forEach((value) => {
                        this.options.xaxis.categories.push(value.month)
                        this.series[0].data.push(value.total)
                        this.dataLoaded = true
                    });
                }
            } catch (e) {
                this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
            }
        },
    }
}
</script>