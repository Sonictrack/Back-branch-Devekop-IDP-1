<template>
  <div>
    <b-tabs content-class="mt-3 border border-info" active-nav-item-class="font-weight-bold text-uppercase text-dark">
      <b-tab title="Majeur">
        <b-card no-body>
            <b-container fluid class="text-center">
            <b-row>
                <b-col cols="7"><u>{{fields[0]}}</u></b-col>
                <b-col><u>{{fields[1]}}</u></b-col>
                <b-col><u>{{fields[2]}}</u></b-col>
                <b-col><u>{{fields[3]}}</u></b-col>
            </b-row>
            <b-row v-for="(item, index) in majeurItems" :key="index">
                <b-col cols="7" class="text-left">{{item.text}}</b-col>
                <b-col><b-icon :icon="chooseIcon(item.premiere_demande)" scale="2" :variant="item.premiere_demande"></b-icon></b-col>
                <b-col><b-icon :icon="chooseIcon(item.renouvellement)" scale="2" :variant="item.renouvellement"></b-icon></b-col>
                <b-col><b-icon :icon="chooseIcon(item.perte_vol)" scale="2" :variant="item.perte_vol"></b-icon></b-col>
            </b-row>
            </b-container>
        </b-card>
      </b-tab>
      <b-tab title="Mineur">
        <b-card no-body>
            <b-container fluid class="text-center">
            <b-row>
                <b-col cols="7"><u>{{fields[0]}}</u></b-col>
                <b-col><u>{{fields[1]}}</u></b-col>
                <b-col><u>{{fields[2]}}</u></b-col>
                <b-col><u>{{fields[3]}}</u></b-col>
            </b-row>
            <b-row v-for="(item, index) in mineurItems" :key="index">
                <b-col cols="7" class="text-left">{{item.text}}</b-col>
                <b-col><b-icon :icon="chooseIcon(item.premiere_demande)" scale="2" :variant="item.premiere_demande"></b-icon></b-col>
                <b-col><b-icon :icon="chooseIcon(item.renouvellement)" scale="2" :variant="item.renouvellement"></b-icon></b-col>
                <b-col><b-icon :icon="chooseIcon(item.perte_vol)" scale="2" :variant="item.perte_vol"></b-icon></b-col>
            </b-row>
            </b-container>
        </b-card>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { PRICE_RENEWAL } from "~/components/enums/price"
  export default {
    name: "RenouvellementJustificatifs",
    data() {
      return {
          demandeCni: PRICE_RENEWAL.TOUS_CAS_CNI,
          ancienDocumentPerdu: PRICE_RENEWAL.ANCIEN_DOCUMENT_PERDU,
          majeurPasseport: PRICE_RENEWAL.MAJEUR_PP,
          mineurMoins15AnsPasseport: PRICE_RENEWAL.MINEUR_MOINS_15_ANS_PP,
          mineurPlus15AnsPasseport: PRICE_RENEWAL.MINEUR_PLUS_15_ANS_PP,
          sauverDocumentRenouvellemnt: PRICE_RENEWAL.SAUVER_DOC_RENOUVELLEMENT,
          fields: ['Justificatifs', '1ère demande', 'Renouvellement', 'Perte ou Vol'],
            majeurItems: [
                { text: "1 photo d'identité de moins de 6 mois et ressemblante.", premiere_demande: "success", renouvellement: "success", perte_vol: "success" },
                { text: "Timbre fiscal (uniquement pour une demande de Passeport).", premiere_demande: "success", renouvellement: "success", perte_vol: "danger" },
                { text: "Timbre fiscal.", premiere_demande: "danger", renouvellement: "danger", perte_vol: "success" },
                { text: "Justificatif de domicile de moins d'un an.", premiere_demande: "success", renouvellement: "success", perte_vol: "success" },
                { text: "Ancien titre : passeport ou carte nationale d'identité (original + photocopie).", premiere_demande: "danger", renouvellement: "success", perte_vol: "danger" },
                { text: "Justificatif de nationalité française.", premiere_demande: "success", renouvellement: "danger", perte_vol: "danger" },
                { text: "Déclaration de perte ou de vol.", premiere_demande: "danger", renouvellement: "danger", perte_vol: "success" }
            ],
            mineurItems: [
                { text: "1 photo d'identité de moins de 6 mois et ressemblante.", premiere_demande: "success", renouvellement: "success", perte_vol: "success" },
                { text: "1 photo d'identité de moins de 6 mois et ressemblante.", premiere_demande: "success", renouvellement: "success", perte_vol: "success" },
                { text: "Timbre fiscal (uniquement pour une demande de Passeport).", premiere_demande: "success", renouvellement: "success", perte_vol: "danger" },
                { text: "Timbre fiscal.", premiere_demande: "danger", renouvellement: "danger", perte_vol: "success" },
                { text: "Justificatif de domicile des parents (original + photocopie) de moins d'un an.", premiere_demande: "success", renouvellement: "success", perte_vol: "success" },
                { text: "Pièce d’identité du parent qui fait la demande (original + photocopie).", premiere_demande: "success", renouvellement: "success", perte_vol: "danger" },
                { text: "Justificatif de nationalité française.", premiere_demande: "success", renouvellement: "danger", perte_vol: "danger" },
                { text: "Ancien titre du mineur.", premiere_demande: "danger", renouvellement: "success", perte_vol: "danger" },
                { text: "Déclaration de perte ou de vol.", premiere_demande: "danger", renouvellement: "danger", perte_vol: "success" }
            ]
      }
    },
    methods:{
        chooseIcon(value){
            return value==='success' ? 'check' : 'x'
        }
    }
  }
</script>
<style scoped>
.col-width{
    column-width: auto
}
</style>