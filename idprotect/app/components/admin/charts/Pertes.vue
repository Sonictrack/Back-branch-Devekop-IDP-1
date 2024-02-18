<template>
    <div>
        <apexchart width="380" type="donut" :options="options" :series="series"></apexchart>
    </div>
</template>

<script>
import { pertes } from "~/api/stats";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { UserType } from "~/components/enums/userType";

export default {
    name: "Pertes",
    mixins: [mixinMessages, mixinUser], 
    data() {
        return {
            options: {labels: []},
            series: [],            
        }
    },
    mounted() {
        this.onLoadPage();
    },
    methods:{
        async onLoadPage() {
        try {
            const response = await pertes(this.$store.state.authentication.type);
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
    }
}
</script>