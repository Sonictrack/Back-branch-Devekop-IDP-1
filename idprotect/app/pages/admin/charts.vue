<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Statistiques</h4>
        <p>Gestion des statistiques.</p>
      </b-alert>
    <hr />
      <b-card no-body>
        <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
          <b-tab title="Clients" active>
            <Clients/>
          </b-tab>
          <b-tab title="Renouvellements" lazy>
            <Renouvellements/>
          </b-tab>
          <b-tab title="Pertes" lazy>
            <Pertes/>
          </b-tab>
        </b-tabs>
      </b-card>
  </div>
</template>

<script>
import Clients from "~/components/admin/charts/Clients";
import Folders from "~/components/admin/charts/Folders";
import Documents from "~/components/admin/charts/Documents";
import Espaces from "~/components/admin/charts/Espaces";
import Renouvellements from "~/components/admin/charts/Renouvellements";
import Pertes from "~/components/admin/charts/Pertes";
import TokenVerification from "~/components/admin/charts/TokenVerification";
import Sessions from "~/components/admin/charts/Sessions";
import Alertes from "~/components/admin/charts/Alertes";
import Coffre from "~/components/admin/charts/Coffre";

export default {
  middleware: "authenticated",
  components: { Clients, Folders, Documents, Espaces, Renouvellements, Pertes, TokenVerification, Sessions, Alertes, Coffre }
}
</script>