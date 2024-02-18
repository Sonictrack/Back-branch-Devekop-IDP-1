<template>
  <div class="mt-3"> 
    <b-alert show variant="secondary">
      <h4 >Gestion de mes dossiers</h4>
      <p>
        Vous pouvez ici gerer vos dossiers en y ajoutant des documents et en
        autorisant des partenaires ou des particuliers demandant un accès à un
        dossier.
      </p>
    </b-alert>
    <hr />
    <Folders />
  </div>
</template>

<script>
import Vue from "vue";
import Folders from "~/components/commons/folders/Folders";

const FoldersPage = Vue.extend({
  name: "mes_dossiers",
  middleware: "authenticated",
  components: { Folders },
});

export default FoldersPage;
</script>
