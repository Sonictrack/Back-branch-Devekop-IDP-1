<template>
  <div class="mt-3 w-50">
    <b-card no-body bg-variant="light">
      <b-tabs card align="center" active-nav-item-class="font-weight-bold text-uppercase text-dark">
        <b-tab title="Connexion" active>
          <div v-if="loginPage">
            <LoginForm :userValueType="type" :name="loginFormName" :loginFunction="login" @successfulLogin="onSuccessfulLogin"/>
              <!-- <div class="text-center" v-if="!isAdmin">
                <b-button variant="link" @click="switchLogin" class="links mt-3">Verifier votre compte ou mot de passe oublié!</b-button>
              </div> -->
          </div>
          <div v-else>
            <!-- <Verification />
            <div class="text-center" v-if="!isAdmin">
              <b-button variant="link" @click="switchLogin" class="links shadow-none mt-3">Page de connexion!</b-button>
            </div> -->
          </div>
        </b-tab>
        <!-- <b-tab title="Inscription" v-if="!isAdmin">
          <RegistrationForm :userValueType="type" :additionalInputs="additionalInputsChoice" :name="loginFormName" :registerFunction="register" @successfulRegistration="onSuccessfulRegistration"/>
        </b-tab> -->
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Vue from "vue"
import Verification from "~/components/commons/access/Verification.vue"
import LoginForm from "~/components/commons/access/LoginForm.vue"
import RegistrationForm from "~/components/commons/access/RegistrationForm.vue"

import { userLogin, userRegister } from "~/api/user"
import mixinMessages from "~/mixins/mixinMessages";
import mixinUser from "~/mixins/mixinUser"

import { Action } from '~/components/enums/action'
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { UserType } from "~/components/enums/userType"

const Access = Vue.extend({
  name: "Access",
  mixins: [mixinMessages, mixinUser],
  components: { RegistrationForm, LoginForm, Verification },
  middleware: "notAuthenticated",
  props: ['type'],
  data() {
    return {
        loginPage: true,
        additionalInputsParticulier: [
        {
          type: "text",
          name: "firstname",
          label: "Prénom",
          placeholder: "Votre prénom",
          possibleErrors: [
            {
              name: "firstname-exist",
              description: "Entrez un prénom.",
              validator: (inputs) => {
                return inputs.firstname.value.length > 0;
              },
            },
          ],
        },
        {
          type: "text",
          name: "lastname",
          label: "Nom de famille",
          placeholder: "Votre nom de famille",
          possibleErrors: [
            {
              name: "lastname-exist",
              description: "Entrez un nom de famille.",
              validator: (inputs) => {
                return inputs.lastname.value.length > 0;
              },
            },
          ],
        }
      ],
      additionalInputsPartenaire: [
        {
          type: "text",
          name: "companyName",
          label: "Nom de l'entreprise",
          placeholder: "Le nom de votre entreprise",
          possibleErrors: [
            {
              name: "company-exists",
              description: "Entrez un nom d'entreprise.",
              validator: (inputs) => {
                return inputs.companyName.value.length > 0;
              },
            },
          ],
        },
        {
          type: "tel",
          name: "phoneNumber",
          label: "Votre numéro de téléphone",
          placeholder: "01 23 45 67 89",
          possibleErrors: [
            {
              name: "phone-exists",
              description: "Entrez un numéro de téléphone valide",
              validator: (inputs) => {
                return !!inputs.phoneNumber.value.match(/^[0-9\-+\s]+$/);
              },
            },
          ],
        },
      ],
    };
  },
  computed:{
    isPartner(){
      return this.type === UserType.partner;
    },
    isParticulier(){
      return this.type === UserType.individual;
    },
    isAdmin(){
      return this.type === UserType.admin;
    },
    loginFormName(){
      return this.isPartner ? "Partenaire" : this.isParticulier ? "Particulier" : "Admin"
    },
    login(){
      return userLogin
    },
    register(){
      return userRegister
    },
    additionalInputsChoice(){
      return this.isPartner ? [...this.additionalInputsParticulier, ...this.additionalInputsPartenaire] : this.additionalInputsParticulier;
    }
  },
  methods: {
    switchLogin(){
      this.loginPage = !this.loginPage
    },
    onSuccessfulLogin(data) {
      this.$store.dispatch("authentication/userLogin", data)

      if(this.isPartner){        
        this.$router.push("/commons/rechercher")
      } else if(this.isParticulier){
        this.$router.push("/particulier/declarer_perte")
      } else {
        this.$router.push("/admin/demands")
      }
    },
    onSuccessfulRegistration(result) {
      this.makeToast('Succès', result, TOAST_MESSAGE_VARIANT.SUCCESS);
      this.$router.push("/")
    }
  }
})

export default Access;
</script>

<style scoped>
.links {
  font-size: 15px;
  line-height: 1.4;
  color:#0067b8;
}
</style>
