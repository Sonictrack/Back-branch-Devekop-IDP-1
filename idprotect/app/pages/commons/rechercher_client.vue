<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Recherche de client</h4>
        <p>Vous pouvez ici rechercher un client et demander l'accès à ses dossiers.</p>
      </b-alert>
    <hr />
    <SearchClient />
  </div>
</template>

<script>
import Vue from "vue";
import SearchClient from "~/components/commons/search/SearchClient";

const SearchClientPage = Vue.extend({
  name: "rechercher_client",
  middleware: "authenticated",
  components: { SearchClient }
});

export default SearchClientPage;
</script>
