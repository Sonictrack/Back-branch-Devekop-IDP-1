<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Gestion des documents perdus</h4>
        <p>
          Vous pouvez ici accéder aux renouvellement et aux documents perdus déclarés par les clients.
        </p>
      </b-alert>
    <hr />
    <Demands/>
  </div>
</template>
<script>
import Demands from "~/components/commons/demands/Demands";

export default {
  middleware: "authenticated",
  components: { Demands }
}
</script>