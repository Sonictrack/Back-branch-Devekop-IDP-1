<template>
    <Access type="admin"/>
</template>

<script>
import Vue from "vue";
import Access from "~/components/commons/access/Access";

const AuthentificationAdminsPage = Vue.extend({
  name: "authentification_admins",
  middleware: "notAuthenticated",
  components: { Access },
});

export default AuthentificationAdminsPage;
</script>
