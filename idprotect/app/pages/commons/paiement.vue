<template>
  <Paiement />
</template>

<script>
import Vue from "vue"
import Paiement from "~/components/commons/paiement/Paiement"

const PaiementPage = Vue.extend({
  name: "paiement",
  middleware: "notAuthenticated",
  components: { Paiement }
})

export default PaiementPage
</script>
