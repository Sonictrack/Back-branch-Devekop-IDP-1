<template>
  <b-form class="mt-3">
    <b-container>
      <ErrorFields :isFormValid="isFatherFiliationValid" :alertFields="alerteFatherFiliation"/>
      <ErrorFields :isFormValid="isMotherFiliationValid" :alertFields="alerteMotherFiliation"/>
      <MandatoryFields/>
      <hr />
      <div class="form-row">
        <b-form-group
          id="father-group"
          label="Père inconnu?"
          label-for="father"
        >
          <b-form-radio-group
            id="father"
            name="father"
            v-model="$v.form.father.$model"
            :options="yesNo"
            buttons
            button-variant="outline-secondary"
            size="sm"
          ></b-form-radio-group>
        </b-form-group>
      </div>

      <div v-if="!isUnknownFather">
        <div class="form-row">
          <b-form-group
            id="fatherLastname-group"
            label="Nom (*)"
            label-for="fatherLastname"
          >
            <b-form-input
              id="fatherLastname"
              name="fatherLastname"
              v-model="$v.form.fatherLastname.$model"
              :state="validateState('fatherLastname')"
              aria-describedby="input-fatherLastname-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-fatherLastname-live-feedback">
              Veuillez saisir le nom du père.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <div class="form-row">
          <b-form-group
            id="fatherFirstname-group"
            label="Prénom (*)"
            label-for="fatherFirstname"
            class="mr-3"
          >
            <b-form-input
              id="fatherFirstname"
              name="fatherFirstname"
              v-model="$v.form.fatherFirstname.$model"
              :state="validateState('fatherFirstname')"
              aria-describedby="input-fatherFirstname-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-fatherFirstname-live-feedback">
              Veuillez saisir le prénom du père.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fatherFirstname2-group"
            label="Deuxième prénom"
            label-for="fatherFirstname2"
            class="mr-3"
          >
            <b-form-input
              id="fatherFirstname2"
              name="fatherFirstname2"
              v-model="$v.form.fatherFirstname2.$model"
              trim
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="fatherFirstname3-group"
            label="Troisième prénom"
            label-for="fatherFirstname3"
          >
            <b-form-input
              id="fatherFirstname3"
              name="fatherFirstname3"
              v-model="$v.form.fatherFirstname3.$model"
              trim
            ></b-form-input>
          </b-form-group>
        </div>

        <div class="form-row">
          <b-form-group
            id="fatherBirthdate-group"
            label="Date de naissance (*)"
            label-for="fatherBirthdate"
          >
            <b-form-input
              id="fatherBirthdate"
              name="fatherBirthdate"
              type="date"
              v-model="$v.form.fatherBirthdate.$model"
              :state="validateState('fatherBirthdate')"
              aria-describedby="input-fatherBirthdate-live-feedback"
              onkeydown="return false"
            ></b-form-input>
            <b-form-invalid-feedback id="input-fatherBirthdate-live-feedback"
              >Veuillez saisir la date de naissance du
              père.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div class="form-row">
          <b-form-group
            id="fatherBirthCountryPlace-group"
            label="Où ? (*)"
            label-for="fatherBirthCountryPlace"
            class="mr-3"
          >
            <b-form-select
              id="fatherBirthCountryPlace"
              name="fatherBirthCountryPlace"
              v-model="$v.form.fatherBirthCountryPlace.$model"
              :options="areaPlace"
              :state="validateState('fatherBirthCountryPlace')"
              aria-describedby="fatherBirthCountryPlace-live-feedback"
            ></b-form-select>
            <b-form-invalid-feedback id="fatherBirthCountryPlace-live-feedback"
              >Veuillez selectionner la pays de naissance du
              père.</b-form-invalid-feedback
            >
          </b-form-group>

          <b-form-group
            id="fatherBirthCityPlace-group"
            label="Ville (*)"
            label-for="fatherBirthCityPlace"
            class="mr-3"
          >
            <b-form-input
              id="fatherBirthCityPlace"
              name="fatherBirthCityPlace"
              v-model="$v.form.fatherBirthCityPlace.$model"
              :state="validateState('fatherBirthCityPlace')"
              aria-describedby="input-fatherBirthCityPlace-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback
              id="input-fatherBirthCityPlace-live-feedback"
            >
              Veuillez saisir la ville de naissance du père.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="fatherNationality-group"
            label="Nationalité (*)"
            label-for="fatherNationality"
          >
            <b-form-input
              id="fatherNationality"
              name="fatherNationality"
              v-model="$v.form.fatherNationality.$model"
              :state="validateState('fatherNationality')"
              aria-describedby="input-fatherNationality-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-fatherNationality-live-feedback">
              Veuillez saisir la nationalité du père.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
      </div>
      <hr />
      <b-form-group id="mother-group" label="Mère inconnue?" label-for="mother">
        <b-form-radio-group
          id="mother"
          name="mother"
          v-model="$v.form.mother.$model"
          :options="yesNo"
          buttons
          button-variant="outline-secondary"
          size="sm"
        ></b-form-radio-group>
      </b-form-group>

      <div v-if="!isUnknownMother">
        <div class="form-row">
          <b-form-group
            id="motherLastname-group"
            label="Nom (*)"
            label-for="motherLastname"
          >
            <b-form-input
              id="motherLastname"
              name="motherLastname"
              v-model="$v.form.motherLastname.$model"
              :state="validateState('motherLastname')"
              aria-describedby="input-motherLastname-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-motherLastname-live-feedback">
              Veuillez saisir le nom de la mère.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <div class="form-row">
          <b-form-group
            id="motherFirstname-group"
            label="Prénom (*)"
            label-for="motherFirstname"
            class="mr-3"
          >
            <b-form-input
              id="motherFirstname"
              name="motherFirstname"
              v-model="$v.form.motherFirstname.$model"
              :state="validateState('motherFirstname')"
              aria-describedby="input-motherFirstname-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-motherFirstname-live-feedback">
              Veuillez saisir le prénom de la mère.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="motherFirstname2-group"
            label="Deuxième prénom"
            label-for="motherFirstname2"
            class="mr-3"
          >
            <b-form-input
              id="motherFirstname2"
              name="motherFirstname2"
              v-model="$v.form.motherFirstname2.$model"
              trim
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="motherFirstname3-group"
            label="Troisième prénom"
            label-for="motherFirstname3"
          >
            <b-form-input
              id="motherFirstname3"
              name="motherFirstname3"
              v-model="$v.form.motherFirstname3.$model"
              trim
            ></b-form-input>
          </b-form-group>
        </div>

        <div class="form-row">
          <b-form-group
            id="motherBirthdate-group"
            label="Date de naissance (*)"
            label-for="motherBirthdate"
          >
            <b-form-input
              id="motherBirthdate"
              name="motherBirthdate"
              type="date"
              v-model="$v.form.motherBirthdate.$model"
              :state="validateState('motherBirthdate')"
              aria-describedby="input-motherBirthdate-live-feedback"
              onkeydown="return false"
            ></b-form-input>
            <b-form-invalid-feedback id="input-motherBirthdate-live-feedback"
              >Veuillez saisir la date de naissance de la
              mère.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div class="form-row">
          <b-form-group
            id="motherBirthCountryPlace-group"
            label="Où? (*)"
            label-for="motherBirthCountryPlace"
            class="mr-3"
          >
            <b-form-select
              id="motherBirthCountryPlace"
              name="motherBirthCountryPlace"
              v-model="$v.form.motherBirthCountryPlace.$model"
              :options="areaPlace"
              :state="validateState('motherBirthCountryPlace')"
              aria-describedby="motherBirthCountryPlace-live-feedback"
            ></b-form-select>
            <b-form-invalid-feedback id="motherBirthCountryPlace-live-feedback"
              >Veuillez saisir le pays de naissance de la
              mère.</b-form-invalid-feedback
            >
          </b-form-group>

          <b-form-group
            id="motherBirthCityPlace-group"
            label="Ville (*)"
            label-for="motherBirthCityPlace"
            class="mr-3"
          >
            <b-form-input
              id="motherBirthCityPlace"
              name="motherBirthCityPlace"
              v-model="$v.form.motherBirthCityPlace.$model"
              :state="validateState('motherBirthCityPlace')"
              aria-describedby="input-motherBirthCityPlace-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback
              id="input-motherBirthCityPlace-live-feedback"
            >
              Veuillez saisir le ville de naissance de la mère.
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="motherNationality-group"
            label="Nationalité (*)"
            label-for="motherNationality"
          >
            <b-form-input
              id="motherNationality"
              name="motherNationality"
              v-model="$v.form.motherNationality.$model"
              :state="validateState('motherNationality')"
              aria-describedby="input-motherNationality-live-feedback"
              trim
            ></b-form-input>
            <b-form-invalid-feedback id="input-motherNationality-live-feedback"
              >Veuillez saisir le pays de la mère.</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
      </div>
      <div class="text-center">
        <hr />
        <b-icon
          id="etat-civil-filiation"
          icon="arrow-left-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="back"
        ></b-icon>
        <b-popover
          target="etat-civil-filiation"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Précédent: Etat civil.
        </b-popover>
        <b-icon
          v-if="isFatherFiliationValid && isMotherFiliationValid"
          id="nationality-filiation"
          icon="arrow-right-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="next"
        ></b-icon>
        <b-popover
          v-if="isFatherFiliationValid && isMotherFiliationValid"
          target="nationality-filiation"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Suivant: Nationalité.
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
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import mixinForm from "~/mixins/mixinForm";
import MandatoryFields from "~/components/commons/utils/MandatoryFields";
import ErrorFields from "~/components/commons/utils/ErrorFields";

export default Vue.extend({
  name: "Filiation",
  mixins: [validationMixin, mixinForm],
  props: ["stepForm"],
  components: {MandatoryFields, ErrorFields},
  data() {
    return {
      alerteFatherFiliation: null,
      alerteMotherFiliation: null,
      form: {
        father: "Non",
        fatherLastname: null,
        fatherFirstname: null,
        fatherFirstname2: null,
        fatherFirstname3: null,
        fatherBirthdate: null,
        fatherBirthCountryPlace: null,
        fatherBirthCityPlace: null,
        fatherNationality: null,
        mother: "Non",
        motherLastname: null,
        motherFirstname: null,
        motherFirstname2: null,
        motherFirstname3: null,
        motherBirthdate: null,
        motherBirthCountryPlace: null,
        motherBirthCityPlace: null,
        motherNationality: null,
      },
    };
  },
  validations: {
    form: {
      father: {},
      fatherLastname: {
        required,
      },
      fatherFirstname: {
        required,
      },
      fatherFirstname2: {},
      fatherFirstname3: {},
      fatherBirthdate: {
        required,
      },
      fatherBirthCountryPlace: {
        required,
      },
      fatherBirthCityPlace: {
        required,
      },
      fatherNationality: {
        required,
      },
      mother: {},
      motherLastname: {
        required,
      },
      motherFirstname: {
        required,
      },
      motherFirstname2: {},
      motherFirstname3: {},
      motherBirthdate: {
        required,
      },
      motherBirthCountryPlace: {
        required,
      },
      motherBirthCityPlace: {
        required,
      },
      motherNationality: {
        required,
      },
    },
  },
  mounted() {
    if (this.stepForm) {
      this.form = this.stepForm;
    }
  },
  computed: {
    isUnknownFather() {
      if (this.form.father === "Non") {
        return false;
      }

      this.form.fatherLastname = "";
      this.form.fatherFirstname = null;
      this.form.fatherFirstname2 = null;
      this.form.fatherFirstname3 = null;
      this.form.fatherBirthdate = null;
      this.form.fatherBirthCountryPlace = null;
      this.form.fatherBirthCityPlace = null;
      this.form.fatherNationality = null;
      return true;
    },
    isUnknownMother() {
      if (this.form.mother === "Non") {
        return false;
      }
      this.form.motherLastname = null;
      this.form.motherFirstname = null;
      this.form.motherFirstname2 = null;
      this.form.motherFirstname3 = null;
      this.form.motherBirthdate = null;
      this.form.motherBirthCountryPlace = null;
      this.form.motherBirthCityPlace = null;
      this.form.motherNationality = null;
      return true;
    },
    isFatherFiliationValid() {
      if (
        this.form.father === "Oui" ||
        (this.form.fatherLastname &&
          this.form.fatherFirstname &&
          this.form.fatherBirthdate &&
          this.form.fatherBirthCountryPlace && 
          this.form.fatherBirthCityPlace &&
          this.form.fatherNationality)
      ) {
        this.alerteFatherFiliation = null;
        return true;
      }

      this.alerteFatherFiliation = [];
      if (!this.form.fatherLastname) 
        this.alerteFatherFiliation.push("Nom de naissance du père non renseigné.");

      if (!this.form.fatherFirstname) 
        this.alerteFatherFiliation.push("Prénom du père non renseigné.");

      if (!this.form.fatherBirthdate)
        this.alerteFatherFiliation.push("Date de naissance du père non renseignée.");

      if (!this.form.fatherBirthCountryPlace)
        this.alerteFatherFiliation.push("Lieu de naissance du père non renseigné.");

      if (!this.form.fatherBirthCityPlace)
        this.alerteFatherFiliation.push("Ville de naissance du père non renseignée.");

      if (!this.form.fatherNationality)
        this.alerteFatherFiliation.push("Nationalité du père non renseignée.");

      return false;
    },
    isMotherFiliationValid() {
      if (
        this.form.mother === "Oui" ||
        (this.form.motherLastname &&
          this.form.motherFirstname &&
          this.form.motherBirthdate &&  
          this.form.motherBirthCountryPlace && 
          this.form.motherBirthCityPlace &&
          this.form.motherNationality)
      ) {
        this.alerteMotherFiliation = null;
        return true;
      }

      this.alerteMotherFiliation = [];
      if (!this.form.motherLastname)
        this.alerteMotherFiliation.push(
          "Nom de naissance de la mère non renseigné."
        );

      if (!this.form.motherFirstname)
        this.alerteMotherFiliation.push("Prénom de la mère non renseigné.");

      if (!this.form.motherBirthdate)
        this.alerteMotherFiliation.push(
          "Date de naissance de la mère non renseignée."
        );

      if (!this.form.motherBirthCountryPlace)
        this.alerteMotherFiliation.push(
          "Lieu de naissance de la mère non renseigné."
        );

      if (!this.form.motherBirthCityPlace)
        this.alerteMotherFiliation.push(
          "Ville de naissance de la mère non renseignée."
        );

      if (!this.form.motherNationality)
        this.alerteMotherFiliation.push(
          "Nationalité de la mère non renseignée."
        );

      return false;
    },
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    // checkUnknownFather() {
    //   return (
    //     this.form.father === "Oui" ||
    //     (this.form.father === "Non" &&
    //       this.form.fatherLastname !== null &&
    //       this.form.fatherFirstname !== null &&
    //       this.form.fatherBirthdate !== null &&
    //       this.form.fatherBirthCountryPlace !== null &&
    //       this.form.fatherBirthCityPlace !== null &&
    //       this.form.fatherNationality !== null)
    //   );
    // },
    // checkUnknownMother() {
    //   return (
    //     this.form.mother === "Oui" ||
    //     (this.form.mother === "Non" &&
    //       this.form.motherLastname !== null &&
    //       this.form.motherFirstname !== null &&
    //       this.form.motherBirthdate !== null &&
    //       this.form.motherBirthCountryPlace !== null &&
    //       this.form.motherBirthCityPlace !== null &&
    //       this.form.motherNationality !== null)
    //   );
    // },
    back() {
      this.$emit("backStepEtatCivil", this.form);
    },
    next() {
      this.$emit("stepFiliationDone", this.form);
    },
  },
});
</script>