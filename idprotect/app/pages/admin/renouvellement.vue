<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Gestion des renouvellements</h4>
        <p>
          Vous pouvez ici gérer les renouvellements des clients.
        </p>
      </b-alert>
    <hr />
    <DemandRenouvellement/>
  </div>
</template>

<script>
import DemandRenouvellement from "~/components/commons/demands/DemandRenouvellement"

export default {
  name: "renouvellement",
  middleware: "authenticated",
  components: { DemandRenouvellement }
};
</script>
