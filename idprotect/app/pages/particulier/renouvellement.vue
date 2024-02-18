<template>
  <div class="mt-3"> 
      <b-alert show variant="secondary" >
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

const RenouvellementParticulierPage = Vue.extend({
  name: "renouvellement_particulier",
  middleware: "authenticated",
  components: { RenouvellementForm }
});

export default RenouvellementParticulierPage
</script>
