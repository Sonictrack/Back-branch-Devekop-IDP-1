<template>
  <div class="mt-3"> 
      <b-alert show variant="secondary" class="mt-3">
        <h4>Demande ou renouvellement de document d'identité</h4>
        <p>
          Renseignez les champs ci-dessous pour effectuer votre démarche en ligne.
        </p>
      </b-alert>
    <hr/>
    <RenouvellementForm/>
  </div>
</template>

<script>
import Vue from "vue";
import RenouvellementForm from '~/components/commons/renouvellement/RenouvellementForm'

const RenouvellementPage = Vue.extend({
  name: "renouvellement",
  middleware: "notAuthenticated",
  components: { RenouvellementForm }
});

export default RenouvellementPage;
</script>
