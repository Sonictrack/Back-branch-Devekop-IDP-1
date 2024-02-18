<template>
    <div>
        <apexchart width="380" type="donut" :options="options" :series="series"></apexchart>
    </div>
</template>

<script>
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { UserType } from "~/components/enums/userType";

export default {
    name: "Alertes",
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

        },
    }
}
</script>