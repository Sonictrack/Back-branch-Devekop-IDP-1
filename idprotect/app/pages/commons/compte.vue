<template>
    <div class="mt-3"> 
        <b-alert show variant="secondary">
          <h4 >Gestion de mon profil</h4>
          <p>
            Vous pouvez ici vérifier vos informations personnelles et supprimer
            votre compte.
          </p>
        </b-alert>
      <hr />
      <Account/>
    </div>
</template>

<script>
import Vue from "vue"
import Account from "~/components/commons/Account"

const ComptePage = Vue.extend({
  name: "compte",
  middleware: "authenticated",
  components: { Account }
})

export default ComptePage
</script>