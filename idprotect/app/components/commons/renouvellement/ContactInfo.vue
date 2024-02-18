<template>
  <b-form class="mt-3">
    <b-container>
      <ErrorFields :isFormValid="isContactInformationValid" :alertFields="alerteContactInformation"/>
      <MandatoryFields/>
      <hr />

      <b-form-group
        id="phoneNumber-group"
        label="Téléphone mobile (*)"
        label-for="phoneNumber"
      >
        <b-form-input
          id="phoneNumber"
          name="phoneNumber"
          v-model="$v.form.phoneNumber.$model"
          :state="validateState('phoneNumber')"
          aria-describedby="input-phoneNumber-live-feedback"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="input-phoneNumber-live-feedback"
          >Veuillez saisir un numéro de téléphone
          mobile.</b-form-invalid-feedback
        >
      </b-form-group>

      <div v-if="!isLoggedIn">
        <b-form-group id="email-group" label="Email (*)" label-for="email">
          <b-form-input
            id="email"
            name="email"
            type="email"
            v-model="$v.form.email.$model"
            :state="validateState('email')"
            aria-describedby="input-email-live-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-email-live-feedback"
            >Veuillez saisir une adresse email
            correcte.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group
          id="password-group"
          label="Mot de passe (*)"
          label-for="password"
        >
          <b-form-input
            id="password"
            name="password"
            type="password"
            v-model="$v.form.password.$model"
            :state="
              validateState('password') && goodPassword($v.form.password.$model)
            "
            aria-describedby="input-password-live-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-password-live-feedback"
            >Ce champs est vide ou ne respecte pas le niveau minimum de
            sécurité.</b-form-invalid-feedback
          >
          <b-popover
            target="password-group"
            triggers="hover"
            placement="top"
            variant="primary"
          >
            8 caractères minimums composés de: 1 minuscule au minimum, 1
            majuscule au minimum et 1 chiffre au minimum
          </b-popover>
        </b-form-group>

        <b-form-group
          id="password2-group"
          label="Confirmez le mot de passe (*)"
          label-for="password2"
        >
          <b-form-input
            id="password2"
            name="password2"
            type="password"
            v-model="$v.form.password2.$model"
            :state="validateState('password2')"
            aria-describedby="input-password2-live-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-password2-live-feedback"
            >Ce champs est vide ou les mots de passe ne sont pas
            identiques.</b-form-invalid-feedback
          >
        </b-form-group>
      </div>

      <div class="text-center">
        <hr />
        <b-icon
          id="adresse-information-contact"
          icon="arrow-left-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="back"
        ></b-icon>
        <b-popover
          target="adresse-information-contact"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Précédent: Adresse.
        </b-popover>
        <b-icon
          v-if="isContactInformationValid"
          id="recapitulatif-information-contact"
          icon="arrow-right-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="next"
        ></b-icon>
        <b-popover
          v-if="isContactInformationValid"
          target="recapitulatif-information-contact"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Suivant: Récapitulatif et Paiement.
        </b-popover>
      </div>
    </b-container>
  </b-form>
</template>

<script>
import Vue from "vue";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  alphaNum,
  alpha,
  numeric,
  maxLength,
  email,
  sameAs,
} from "vuelidate/lib/validators";
import mixinForm from "~/mixins/mixinForm";
import mixinMessages from "~/mixins/mixinMessages";
import { checkEmailUsed } from "~/api/user"

import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import MandatoryFields from "~/components/commons/utils/MandatoryFields";
import ErrorFields from "~/components/commons/utils/ErrorFields";

export default Vue.extend({
  name: "ContactInfo",
  mixins: [validationMixin, mixinMessages, mixinForm],
  props: ["stepForm"],
  components: {MandatoryFields, ErrorFields},
  data() {
    return {
      alerteContactInformation: null,
      form: {
        phoneNumber: null,
        email: null,
        password: null,
        password2: null,
      },
    };
  },
  validations: {
    form: {
      phoneNumber: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
      },
      password2: {
        required,
        sameAs: sameAs("password"),
      },
    },
  },
  mounted() {
    if (this.stepForm) {
      this.form = this.stepForm;
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.authentication.type !== null;
    },
    isContactInformationValid() {
      if (!this.isLoggedIn) {
        if (
          this.form.phoneNumber &&
          this.form.email && this.validateEmail(this.form.email) &&
          this.form.password &&
          this.form.password2 &&
          this.form.password === this.form.password2
        ) {
          this.alerteContactInformation = null;
          return true;
        }
      } else {
        if (this.form.phoneNumber) {
          this.alerteContactInformation = null;
          return true;
        }
      }

      this.alerteContactInformation = [];
      if (!this.form.phoneNumber) {
        this.alerteContactInformation.push("Téléphone mobile non renseigné.");
      }

      if (!this.isLoggedIn) {
        if (!this.form.email || !this.validateEmail(this.form.email)) {
          this.alerteContactInformation.push("Email non renseigné.");
        }

        if (!this.form.password) {
          this.alerteContactInformation.push("Mot de passe non renseigné.");
        }

        if (!this.form.password2) {
          this.alerteContactInformation.push(
            "Confirmation du mot de passe non renseigné."
          );
        }

        if (
          this.form.password &&
          this.form.password2 &&
          this.form.password !== this.form.password2
        ) {
          this.alerteContactInformation.push(
            "Les mots de passe ne sont pas identiques."
          );
        }

        if (this.form.password && !this.goodPassword(this.form.password)) {
          this.alerteContactInformation.push(
            "Mot de passe ne respectant pas le degré de sécurité."
          );
        }

        if (this.form.password2 && !this.goodPassword(this.form.password2)) {
          this.alerteContactInformation.push(
            "Confirmation du mot de passe ne respectant pas le degré de sécurité."
          );
        }
      }

      return false;
    },
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    back() {
      this.$emit("backStepAdress", this.form);
    },
    async next(){
      try{
        if(!this.isLoggedIn){
          const response = await checkEmailUsed(this.form.email)
          const json = await response.json()

          if (json.error){
            throw new Error(json.error)
          }
        }

        this.$emit("stepContactInfoDone", this.form);
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    }
  },
});
</script>
