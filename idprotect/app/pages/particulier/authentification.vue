<template>
    <Access type="individual"/>
</template>

<script>
import Vue from "vue";

import Access from "~/components/commons/access/Access";

const AuthentificationParticuliersPage = Vue.extend({
  name: "authentification_particuliers",
  middleware: "notAuthenticated",
  components: { Access }
});

export default AuthentificationParticuliersPage;
</script>
