<template>
      <b-card no-body>
        <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
          <b-tab title="Pertes" active>
            <DemandPerte />
          </b-tab>
          <b-tab title="Renouvellements" lazy>
            <DemandRenouvellement/>
          </b-tab>
        </b-tabs>
      </b-card>
</template>

<script>
import Vue from "vue"
import DemandPerte from "~/components/commons/demands/DemandPerte"
import DemandRenouvellement from "~/components/commons/demands/DemandRenouvellement"

const Demands = Vue.extend({
  name: "Demands",
  components: { DemandPerte, DemandRenouvellement }
});

export default Demands
</script>