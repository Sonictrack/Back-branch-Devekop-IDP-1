<template>
  <div class="mt-3">
    <b-alert show variant="secondary">
      <h4>Offrir des crédits</h4>
      <p>
        Vous pouvez offrir des crédits aux utilisateurs sur cette page.
      </p>
    </b-alert>
    <hr/>
    <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
      <b-tab title="Formulaire" class="pt-5" active>
        <OfferCreditsForm />
      </b-tab>
      <b-tab title="Historique" class="pt-5" lazy>
        <OfferCreditsHistory />
      </b-tab>
    </b-tabs>

  </div>
</template>

<script>
import Vue from 'vue'
import OfferCreditsForm from "~/components/admin/OfferCreditsForm"
import OfferCreditsHistory from "~/components/admin/OfferCreditsHistory"

const OfferCreditsPage = Vue.extend({
  name: 'offercredits',
  middleware: 'authenticated',
  components: {OfferCreditsForm, OfferCreditsHistory}
})

export default OfferCreditsPage
</script>

