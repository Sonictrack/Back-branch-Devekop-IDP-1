<template>
  <b-form>
    <b-card
      bg-variant="light"
      border-variant="primary"
      header-tag="header"
      header-bg-variant="light"
      footer-tag="footer"
      class="text-left"
    >
      <template v-slot:header>
          <b-badge
            pill
            variant="primary"
          ><h3>Edition</h3></b-badge>
      </template>

      <b-form-group
        id="type-group"
        label="Type de document"
        label-for="type"
      >
        <b-form-select
          id="type"
          name="type"
          v-model="$v.form.type.$model"
          :options="documentTypes"
          :state="validateState('type')"
          aria-describedby="type-live-feedback"
        ></b-form-select>
        <b-form-invalid-feedback id="type-live-feedback"
          >Veuillez préciser le type de document.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group
        id="number-group"
        label="N° de la pièce"
        label-for="number"
      >
        <b-form-input
          id="number"
          name="number"
          v-model="$v.form.number.$model"
          :state="validateState('number')"
          aria-describedby="input-number-live-feedback"
          trim
          :maxlength="documentNumberMaxLength"
        ></b-form-input>
        <b-form-invalid-feedback id="input-number-live-feedback">
          Veuillez saisir le numéro du document.
        </b-form-invalid-feedback>
        <b-popover
          target="number-group"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Le numéro doit avoir entre 9 et 10 caractères.
        </b-popover>
      </b-form-group>

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
          >Veuillez saisir une adresse email correcte.</b-form-invalid-feedback
        >
      </b-form-group>

        <template v-slot:footer>
            <div class="text-center">
                <b-avatar button id="validate-update" icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="update" @submit.prevent="close(true)" :disabled="$v.form.$invalid"></b-avatar>
                <b-avatar button id="cancel-update" icon="x" class="align-center" variant="danger" font-scale="2" @click="close(false)"></b-avatar>
                <b-popover target="validate-update" triggers="hover" placement="top" variant="primary">Valider</b-popover>
                <b-popover target="cancel-update" triggers="hover" placement="top" variant="danger">Annuler</b-popover>
              </div>
        </template>
    </b-card>
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
} from "vuelidate/lib/validators";
import { update } from "~/api/lockdocument";
import mixinForm from "~/mixins/mixinForm";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { checkEmailUsed } from "~/api/user";
import MandatoryFields from "~/components/commons/utils/MandatoryFields";
import ErrorFields from "~/components/commons/utils/ErrorFields";

export default {
  name: "LockDocument",
  mixins: [validationMixin, mixinForm],
  props: ["documentProp"],
  data() {
    return {
        documentNumberMaxLength: 12,
        form: {
            id: this.documentProp.id,
            type: this.documentProp.type,
            number: this.documentProp.number,
            email: this.documentProp.email,
        },
    };
  },
  validations: {
    form: {
      type: {
        required,
      },
      number: {
        required,
        minLength: minLength(9),
        maxLength: maxLength(12),
        alphaNum,
      },
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    async update(){
      try{
          const response = await update(this.$store.state.authentication.type, this.form)
          const json = await response.json()

          if (json.error) {
            throw new Error(json.error)
          }

        this.makeToast('Succès', "Mise à jour éfféctuée avec succès.", TOAST_MESSAGE_VARIANT.SUCCESS);
        this.close(true);
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    close(value){
        this.$emit("close", value);
    }
  },
};
</script>
