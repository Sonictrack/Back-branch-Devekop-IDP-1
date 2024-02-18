<template>
    <div>
            <h4><b-badge pill variant="secondary">Détail du montant à payer</b-badge></h4>
            <b-table-simple fixed hover striped small bordered collapse caption-top responsive>
              <b-tbody>
                <b-tr v-for="(line, index) in paymentDetails" :key="index">
                    <b-th>{{line.detail}}</b-th>
                    <b-td class="font-weight-bold">{{line.amount}} €</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
    </div>
</template>

<script>
export default {
    name: "PaiementDetail",
    props:["paymentDetails","total"],
}
</script>