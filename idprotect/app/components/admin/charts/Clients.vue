<template>
    <b-container>
        <b-row>
            <b-col><apexchart id="clients" width="380" type="donut" :options="options" :series="series"></apexchart></b-col>
            <b-col><apexchart id="clients_per_month" type="line" width="380" :options="optionsPerMonth" :series="seriesPerMonth"></apexchart></b-col>
        </b-row>
    </b-container>
</template>

<script>
import { clients, clientsPerWeek, clientsPerMonth } from "~/api/stats";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

export default {
    name: "Clients",
    mixins: [mixinMessages, mixinUser], 
    data() {
        return {
            options: {
                title: {
                    text: 'Nombre de clients'
                },
                labels: []},
            series: [],
            optionsPerMonth: {
                title: {
                    text: 'Nombre de clients par mois'
                },
                stroke: {
                    width: [0, 4]
                },
                xaxis: {
                    type: 'category',
                    categories: []
                }
            },
            seriesPerMonth: [{
                name: 'Nombre de clients par mois',
                type: 'column',
                data: []
            }]        
        }
    },
    mounted() {
        this.allClients();
        this.allClientsPerMonth()
    },
    methods:{
        async allClients() {
            try {
                const response = await clients(this.$store.state.authentication.type);
                const json = await response.json();

                if (json.error) {
                    throw new Error(json.error);
                }

                const values = json.results;
                if(values){
                    values.forEach((value) => {
                        this.options.labels.push(value.type)
                        this.series.push(value.count)
                    });
                }
            } catch (e) {
                this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
                return;
            }
        },
        async allClientsPerMonth() {
            try {
                const response = await clientsPerMonth(this.$store.state.authentication.type);
                const json = await response.json();

                if (json.error) {
                    throw new Error(json.error);
                }

                const values = json.results;
                values.forEach((value) => {                        
                        this.optionsPerMonth.xaxis.categories.push(value.week)
                        this.seriesPerMonth[0].data.push(value.total)
                    });
            } catch (e) {
                this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
            }
        },
    }
}
</script>