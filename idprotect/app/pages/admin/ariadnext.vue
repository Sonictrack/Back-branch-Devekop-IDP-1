<template>
  <div class="mt-3">
    <b-alert show variant="secondary">
      <h4>Vérification d'un document d'identité</h4>
      <p>
        Vous pouvez ici vérifier si un document est un faux par AriadNextHistorique.
      </p>
    </b-alert>
    <hr/>
    <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
      <b-tab title="Verification" active>
        <AriadNext/>
      </b-tab>
      <b-tab title="Historiques" lazy>
        <AriadNextHistorique/>
      </b-tab>
    </b-tabs>

  </div>
</template>

<script>
import Vue from 'vue'
import AriadNext from '~/components/admin/AriadNext'
import AriadNextHistorique from '~/components/admin/AriadNextHistorique'

const AriadNextPage = Vue.extend({
  name: 'ariadnext',
  middleware: 'authenticated',
  components: {AriadNext, AriadNextHistorique}
})

export default AriadNextPage
</script>
