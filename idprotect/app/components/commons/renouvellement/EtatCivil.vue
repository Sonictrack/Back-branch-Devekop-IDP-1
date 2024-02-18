<template>
  <b-form class="mt-3">
    <b-container>
      <ErrorFields :isFormValid="isEtatCivilValid" :alertFields="alerteEtatCivil"/>
      <MandatoryFields/>
      <hr />
      <div class="form-row">
        <b-form-group id="sexe-group" label="Votre sexe" label-for="sexe">
          <b-form-radio-group
            id="sexe"
            name="sexe"
            v-model="$v.form.sexe.$model"
            :options="sexes"
            buttons
            button-variant="outline-secondary"
            size="sm"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="lastname-group"
          label="Nom de naissance (*)"
          label-for="lastname"
          class="mr-3"
        >
          <b-form-input
            id="lastname"
            name="lastname"
            v-model="$v.form.lastname.$model"
            :state="validateState('lastname')"
            aria-describedby="input-lastname-live-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-lastname-live-feedback">
            Veuillez saisir le nom.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="lastname2-group"
          label="Deuxième nom"
          label-for="lastname2"
        >
          <b-form-input
            id="lastname2"
            name="lastname2"
            v-model="$v.form.lastname2.$model"
            trim
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="lastnameOrigine-group"
          label="Il s'agit du nom"
          label-for="lastnameOrigine"
          v-if="!hideLastnameOrigine"
        >
          <b-form-radio-group
            id="lastnameOrigine"
            name="lastnameOrigine"
            v-model="$v.form.lastnameOrigine.$model"
            :options="lastnameOrigines"
            buttons
            button-variant="outline-secondary"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="prefixeLastname-group"
          label="Voulez-vous faire apparaître un mot devant le deuxième nom"
          label-for="prefixeLastname"
          v-if="!hidePrefixeLastname"
        >
          <b-form-radio-group
            id="prefixeLastname"
            name="prefixeLastname"
            v-model="$v.form.prefixeLastname.$model"
            :options="yesNo"
            buttons
            button-variant="outline-secondary"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="prefixeLastnameValue-group"
          label="Si oui, lequel"
          label-for="prefixeLastnameValue"
          v-if="!hidePrefixeLastnameValue"
        >
          <b-form-radio-group
            id="prefixeLastnameValue"
            name="prefixeLastnameValue"
            v-model="$v.form.prefixeLastnameValue.$model"
            :options="prefixeLastnameValues"
            buttons
            button-variant="outline-secondary"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="firstname-group"
          label="Prénom (*)"
          label-for="firstname"
          class="mr-3"
        >
          <b-form-input
            id="firstname"
            name="firstname"
            v-model="$v.form.firstname.$model"
            :state="validateState('firstname')"
            aria-describedby="input-firstname-live-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-firstname-live-feedback">
            Veuillez saisir le prénom.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="firstname2-group"
          label="Deuxième prénom"
          label-for="firstname2"
          class="mr-3"
        >
          <b-form-input
            id="firstname2"
            name="firstname2"
            v-model="$v.form.firstname2.$model"
            trim
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="firstname3-group"
          label="Troisième prénom"
          label-for="firstname3"
        >
          <b-form-input
            id="firstname3"
            name="firstname3"
            v-model="$v.form.firstname3.$model"
            trim
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="eyesColor-group"
          label="Votre couleur des yeux (*)"
          label-for="eyesColor"
          class="mr-3"
        >
          <b-form-select
            id="eyesColor"
            name="eyesColor"
            v-model="$v.form.eyesColor.$model"
            :options="eyesColors"
            :state="validateState('eyesColor')"
            aria-describedby="eyesColor-live-feedback"
          ></b-form-select>
          <b-form-invalid-feedback id="eyesColor-live-feedback"
            >Veuillez selectionner la couleur des yeux.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group id="heigth-group" label-for="heigth" class="mr-3">
          <label for="range-2"
            >Votre taille : {{ $v.form.heigth.$model }} cm</label
          >
          <b-form-input
            id="heigth"
            name="heigth"
            type="range"
            min="50"
            max="220"
            step="1"
            v-model="$v.form.heigth.$model"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="birthdate-group"
          label="Date de naissance (*)"
          label-for="birthdate"
        >
          <b-form-input
            id="birthdate"
            name="birthdate"
            type="date"
            v-model="$v.form.birthdate.$model"
            :state="validateState('birthdate')"
            aria-describedby="input-birthdate-live-feedback"
            onkeydown="return false"
          ></b-form-input>
          <b-form-invalid-feedback id="input-birthdate-live-feedback"
            >Veuillez saisir la date de naissance.</b-form-invalid-feedback
          >
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group
          id="birthCountryPlace-group"
          label="Pays de naissance (*)"
          label-for="birthCountryPlace"
          class="mr-3"
        >
          <b-form-select
            id="birthCountryPlace"
            name="birthCountryPlace"
            v-model="$v.form.birthCountryPlace.$model"
            :options="birthCountryPlaces"
            :state="validateState('birthCountryPlace')"
            aria-describedby="birthCountryPlace-live-feedback"
          ></b-form-select>
          <b-form-invalid-feedback id="birthCountryPlace-live-feedback"
            >Veuillez selectionner le pays de
            naissance.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group
          id="birthDepartementPlace-group"
          label="Département de naissance (*)"
          label-for="birthDepartementPlace"
          class="mr-3"
          v-if="!hideDepartements"
        >
          <b-form-select
            id="birthDepartementPlace"
            name="birthDepartementPlace"
            v-model="$v.form.birthDepartementPlace.$model"
            :options="departements"
            :state="validateState('birthDepartementPlace')"
            aria-describedby="birthDepartementPlace-live-feedback"
          ></b-form-select>
          <b-form-invalid-feedback id="birthDepartementPlace-live-feedback"
            >Veuillez selectionner le département de
            naissance.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group
          id="birthCityPlace-group"
          label="Ville de naissance (*)"
          label-for="birthCityPlace"
        >
          <b-form-input
            id="birthCityPlace"
            name="birthCityPlace"
            v-model="$v.form.birthCityPlace.$model"
            :state="validateState('birthCityPlace')"
            aria-describedby="input-birthCityPlace-live-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-birthCityPlace-live-feedback">
            Veuillez saisir la ville de naissance.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <div class="text-center">
        <hr />
        <b-icon
          id="motif-etat-civil"
          icon="arrow-left-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="back"
        ></b-icon>
        <b-popover
          target="motif-etat-civil"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Précédent: Motif.
        </b-popover>
        <b-icon
          v-if="isEtatCivilValid"
          id="filiation-etat-civil"
          icon="arrow-right-circle"
          class="arrow-style rounded p-2"
          variant="secondary"
          @click="next"
        ></b-icon>
        <b-popover
          v-if="isEtatCivilValid"
          target="filiation-etat-civil"
          triggers="hover"
          placement="top"
          variant="primary"
        >
          Suivant: Filiation
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
import mixinForm from "~/mixins/mixinForm";

import { UserType } from "~/components/enums/userType";
import { PRICE_RENEWAL } from "~/components/enums/price";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import MandatoryFields from "~/components/commons/utils/MandatoryFields";
import ErrorFields from "~/components/commons/utils/ErrorFields";

export default Vue.extend({
  name: "EtatCivil",
  mixins: [validationMixin, mixinForm],
  props: ["stepForm"],
  components: {MandatoryFields, ErrorFields},
  data() {
    return {
      alerteEtatCivil: null,
      form: {
        sexe: "Femme",
        lastname: null,
        lastname2: null,
        lastnameOrigine: null,
        prefixeLastname: null,
        prefixeLastnameValue: null,
        firstname: null,
        firstname2: null,
        firstname3: null,
        heigth: 50,
        eyesColor: null,
        birthdate: null,
        birthCountryPlace: null,
        birthDepartementPlace: null,
        birthCityPlace: null,
      },
    };
  },
  validations: {
    form: {
      sexe: {},
      lastname: {
        required,
      },
      lastname2: {},
      lastnameOrigine: {},
      prefixeLastname: {},
      prefixeLastnameValue: {},
      firstname: {
        required,
      },
      firstname2: {},
      firstname3: {},
      heigth: {},
      eyesColor: {
        required,
      },
      birthdate: {
        required,
      },
      birthCountryPlace: {
        required,
      },
      birthDepartementPlace: {
        required,
      },
      birthCityPlace: {
        required,
      },
    },
  },
  mounted() {
    if (this.stepForm)
      this.form = this.stepForm;
  },
  computed: {
    hideLastnameOrigine() {
      if (this.form.lastname2 === null || this.form.lastname2 === "") {
        this.form.lastnameOrigine = null;
        this.form.prefixeLastname = null;
        this.form.prefixeLastnameValue = null;
        return true;
      }
      return false;
    },
    hidePrefixeLastname() {
      if (
        this.form.lastnameOrigine === null ||
        this.form.lastnameOrigine === ""
      ) {
        this.form.prefixeLastname = null;
        return true;
      }
      return false;
    },
    hidePrefixeLastnameValue() {
      if (
        this.form.prefixeLastname === null ||
        this.form.prefixeLastname === "" ||
        this.form.prefixeLastname === "Non"
      ) {
        return true;
      }
      return false;
    },
    hideDepartements() {
      if (this.form.birthCountryPlace !== "81") {
        this.form.birthDepartementPlace = null;
        return true;
      }
      // this.form.birthDepartementPlace = null;
      return false;
    },
    isEtatCivilValid() {
      if (
        this.form.lastname &&
        this.form.firstname &&
        this.form.heigth &&
        this.form.birthdate &&
        this.form.eyesColor &&
        ((this.form.birthCountryPlace &&
          this.form.birthCountryPlace !== "81") ||
          (this.form.birthCountryPlace === "81" &&
            this.form.birthDepartementPlace)) &&
        this.form.birthCityPlace
      ) {
        this.alerteEtatCivil = null;
        return true;
      }

      this.alerteEtatCivil = [];
      if (!this.form.lastname)
        this.alerteEtatCivil.push("Nom de naissance non renseigné.");

      if (!this.form.firstname)
        this.alerteEtatCivil.push("Prénom non renseigné.");

      if (!this.form.heigth)
        this.alerteEtatCivil.push("Taille (en cm) non renseignée.");

      if (!this.form.birthdate)
        this.alerteEtatCivil.push("Date de naissance non renseignée.");

      if (!this.form.eyesColor)
        this.alerteEtatCivil.push("Couleur des yeux non renseignée.");

      if (!this.form.birthCountryPlace)
        this.alerteEtatCivil.push("Pays non renseigné.");

      if (this.form.birthCountryPlace === "81" && !this.form.birthDepartementPlace) 
        this.alerteEtatCivil.push("Département non renseigné.");

      if (!this.form.birthCityPlace)
        this.alerteEtatCivil.push("Ville non renseignée.");

      return false;
    },
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    back() {
      this.$emit("backStepMotif", this.form);
    },
    next() {
      this.$emit("stepEtatCivilDone", this.form);
    },
  },
});
</script>
