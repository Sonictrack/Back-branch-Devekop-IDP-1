<template>
  <div class="mt-3"> 
        <b-alert show variant="secondary">
          <h4 >Gestion de mes demandes</h4>
          <p>Vous pouvez ici vérifier toutes vos demandes effectuées pour une perte de documents ou un renouvellement.</p>
        </b-alert>
      <hr />
      <Demands/>
  </div>
</template>

<script>
import Vue from "vue";
import Demands from "~/components/commons/demands//Demands";

const DemandsPage = Vue.extend({
  name: "mes_demandes",
  middleware: "authenticated",
  components: { Demands }
});

export default DemandsPage;
</script>
