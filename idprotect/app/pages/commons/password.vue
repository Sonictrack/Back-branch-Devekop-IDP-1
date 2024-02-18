<template>
  <div class="mt-3">
        <b-alert show variant="secondary">
          <h4>Changer votre mots de passe</h4>
          <p>Veillez bien à respecter le niveau de sécurité de votre mot de passe :</p>
          <ul>
            <li>8 caractères minimums.</li>
            <li>Dont une lettre minuscule au minimum.</li>
            <li>Dont une lettre majuscule au minimum.</li>
            <li>Dont un chiffre au minimum.</li>
          </ul>
        </b-alert>
              <hr/>
      <Password />
  </div>
</template>

<script>
import Vue from "vue"
import Password from "~/components/commons/access/Password"

const PasswordPage = Vue.extend({
  name: "password",
  middleware: "notAuthenticated",
  components: { Password }
})

export default PasswordPage
</script>
