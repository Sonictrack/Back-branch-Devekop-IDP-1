<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Tableau de bord</h4>
        <p>
          Vous pouvez ici avoir des informations sur l'application ID Protect.
        </p>
      </b-alert>
    <hr />
    <div>
        <b-card-group deck>
            <b-card bg-variant="danger" text-variant="white" header="Alertes" class="text-center">
                <b-card-text>Alertes envoyées par l'application.</b-card-text>
            </b-card>

            <b-card bg-variant="info" text-variant="white" header="Positions" class="text-center">
                <b-card-text>Alertes envoyées par l'application.</b-card-text>
            </b-card>

            <b-card bg-variant="info" text-variant="white" header="Espace" class="text-center">
                <b-card-text>Alertes envoyées par l'application.</b-card-text>
            </b-card>
        </b-card-group>

        <b-card-group deck class="mt-3">
            <b-card bg-variant="info" text-variant="white" header="Pertes" class="text-center">
                <b-card-text>Pertes des documents signalées par les clients.</b-card-text>
            </b-card>

            <b-card bg-variant="info" text-variant="white" header="Renouvellements" class="text-center">
                <b-card-text>Gestions des renouvellements des clients.</b-card-text>
            </b-card>

            <b-card bg-variant="dark" text-variant="white" header="Admins" class="text-center">
                <b-card-text>Gestion des administrateurs.</b-card-text>
            </b-card>
        </b-card-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "dashboard",
  middleware: "authenticated",

}
</script>

<style scoped></style>
