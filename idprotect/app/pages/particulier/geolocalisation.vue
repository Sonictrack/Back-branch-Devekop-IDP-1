<template>
  <div class="mt-3"> 
      <b-alert show variant="secondary">
        <h4 >Géolocalisation</h4>
        <p>
          Ici sont enregistrés toutes les positions des recherches
          d'utilisateurs sur vos documents.
        </p>
      </b-alert>
    <hr />
      <b-card no-body>
        <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
          <b-tab title="Maps" active>
            <GoogleMap />
          </b-tab>
          <b-tab title="Informations" lazy>
            <Informations/>
          </b-tab>
        </b-tabs>
      </b-card>
  </div>
</template>

<script>
import Vue from "vue";
import GoogleMap from "~/components/commons/google/GoogleMap";
import Informations from "~/components/commons/google/Informations";

const GeolocalisationPage = Vue.extend({
  name: "geolocalisation",
  middleware: "authenticated",
  components: { GoogleMap,Informations },
});

export default GeolocalisationPage;
</script>
