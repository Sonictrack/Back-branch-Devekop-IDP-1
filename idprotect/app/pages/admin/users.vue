<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Gestion des utilisateurs</h4>
        <p>
          Vous pouvez ici gérer les utilisateurs.
        </p>
      </b-alert>
    <hr />
    <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
      <b-tab title="Clients" active>
        <Utilisateurs/>
      </b-tab>
      <b-tab title="Administrateurs" lazy>
        <Admins/>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Utilisateurs from "~/components/admin/Utilisateurs"
import Admins from "~/components/admin/Admins"

export default {
  name: "utilisateurs",
  middleware: "authenticated",
  components: { Utilisateurs, Admins }
};
</script>

<style scoped></style>