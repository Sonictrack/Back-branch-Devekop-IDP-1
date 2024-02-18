<template>
  <div>
      <div>
        <b-alert show variant="secondary">
          <h4 >Confirmation de compte</h4>
          <p>
            Cela vous permet de valider votre compte ID Protect grace à au lien reçu dans votre boite email.
          </p>
        </b-alert>
      </div>
      <hr/>
    <Confirmation />
  </div>
</template>

<script>
import Vue from "vue"
import Confirmation from "~/components/commons/access/Confirmation"

const ConfirmationPage = Vue.extend({
  name: "confirmation",
  middleware: "notAuthenticated",
  components: { Confirmation }
})

export default ConfirmationPage
</script>
