<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Gestion du coffre</h4>
        <p>
          Vous pouvez ici gérer les documents des clients présents dans le coffre.
        </p>
      </b-alert>
    <hr />
    <LockDocuments/>
  </div>
</template>

<script>
import LockDocuments from "~/components/admin/LockDocuments"

export default {
  name: "lockdocument",
  middleware: "authenticated",
  components: { LockDocuments }
};
</script>