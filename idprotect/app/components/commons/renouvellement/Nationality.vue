<template>
  <b-form class="mt-3">
    <b-container>
      <ErrorFields :isFormValid="isNationalityValid" :alertFields="alerteNationality"/>
      <MandatoryFields/>
      <hr />
      <b-form-group
        id="nationality-group"
        label="Vous êtes français(e) parce que (*)"
        label-for="nationality"
      >
        <b-form-checkbox-group
          v-model="$v.form.nationality.$model"
          :options="nationalityOptions"
          class="mb-3"
          value-field="value"
          text-field="text"
          disabled-field="notEnabled"
          :state="validateState('nationality')"
          stacked
        ></b-form-checkbox-group>
      </b-form-group>
      <div class="text-center">
        <hr />
        <b-icon
          id="filiation-nationality"
          icon="arrow-left-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="back"
        ></b-icon>
        <b-popover
          target="filiation-nationality"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Précédent: Filiation.
        </b-popover>
        <b-icon
          v-if="isNationalityValid"
          id="adresse-nationality"
          icon="arrow-right-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="next"
        ></b-icon>
        <b-popover
          v-if="isNationalityValid"
          target="adresse-nationality"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Suivant: Adresse.
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
import MandatoryFields from "~/components/commons/utils/MandatoryFields";
import ErrorFields from "~/components/commons/utils/ErrorFields";

export default Vue.extend({
  name: "Nationality",
  mixins: [validationMixin, mixinForm],
  props: ["stepForm"],
  components: {MandatoryFields, ErrorFields},
  data() {
    return {
      alerteNationality: null,
      form: {
        nationality: [],
      },
    };
  },
  validations: {
    form: {
      nationality: {
        required,
      },
    },
  },
  mounted() {
    if (this.stepForm)
      this.form = this.stepForm;
  },
  computed: {
    isNationalityValid() {
      if (this.form.nationality && this.form.nationality.length > 0) {
        this.alerteNationality = null;
        return true;
      }

      this.alerteNationality = [];
      if (!this.form.nationality || this.form.nationality.length === 0)
        this.alerteNationality.push("Nationalité non renseignée.");

      return false;
    },
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    back() {
      this.$emit("backStepFiliation", this.form);
    },
    next() {
      this.$emit("stepNationalityDone", this.form);
    },
  },
});
</script>
