<template>
    <Access type="partner"/>
</template>

<script>
import Vue from "vue";
import Access from "~/components/commons/access/Access";

const AuthentificationPartnersPage = Vue.extend({
  name: "authentification_partenaires",
  middleware: "notAuthenticated",
  components: { Access }
});

export default AuthentificationPartnersPage;
</script>
