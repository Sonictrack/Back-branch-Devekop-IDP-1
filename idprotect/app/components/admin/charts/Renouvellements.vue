<template>
    <b-container>
        <b-row>
            <b-col><apexchart width="380" type="donut" :options="optionsTypes" :series="seriesTypes"></apexchart></b-col>
            <b-col><apexchart width="380" type="donut" :options="optionsStatus" :series="seriesStatus"></apexchart></b-col>
        </b-row>
    </b-container>
</template>

<script>
import { renouvellements } from "~/api/stats";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { UserType } from "~/components/enums/userType";

export default {
    name: "Renouvellements",
    mixins: [mixinMessages, mixinUser], 
    data() {
        return {
            optionsTypes: {                
                title: {
                    text: 'Type de documents'
                },
                labels: []},
            seriesTypes: [],
            optionsStatus: {
                title: {
                    text: 'Status'
                },
                labels: []},
            seriesStatus: [],               
        }
    },
    mounted() {
        this.onLoadPage();
    },
    methods:{
        async onLoadPage() {
        try {
            const response = await renouvellements(this.$store.state.authentication.type);
            const json = await response.json();

            if (json.error) {
                throw new Error(json.error);
            }

            const types = json.types;
            if(types){
                types.forEach((value) => {
                    this.optionsTypes.labels.push(value.type)
                    this.seriesTypes.push(value.count)
                });
            }

            const status = json.status;
            if(status){
                status.forEach((value) => {
                    this.optionsStatus.labels.push(value.status)
                    this.seriesStatus.push(value.count)
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