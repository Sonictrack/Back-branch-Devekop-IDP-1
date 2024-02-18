<template>
    <b-form class="mt-3">
      <b-container>
          <ErrorFields :isFormValid="isAdressValid" :alertFields="alerteAdress"/>
          <MandatoryFields/>
          <hr />          

            <div class="form-row">
                <b-form-group id="streetNumber-group" label="N° de la voie" label-for="streetNumber" class="col-md-3 mr-3">
                  <b-form-input
                    id="streetNumber"
                    name="streetNumber"
                    type="number"
                    min="1"
                    v-model="$v.form.streetNumber.$model"
                    trim
                  ></b-form-input>
                <b-popover target="streetNumber-group" triggers="hover" placement="top" variant="primary">
                  Le numéro doit être composé de chiffres.
                </b-popover>
                </b-form-group>

            <b-form-group id="streetExtension-group" label="Extension" label-for="streetExtension" class="col-md-3 mr-3">
              <b-form-select
                id="streetExtension"
                name="streetExtension"
                v-model="$v.form.streetExtension.$model"
                :options="streetExtensions"
              ></b-form-select>
            </b-form-group>

            <b-form-group id="streetType-group" label="Type de voie" label-for="streetType" class="col-md-3 mr-3">
              <b-form-select
                id="streetType"
                name="streetType"
                v-model="$v.form.streetType.$model"
                :options="streetTypes"
              ></b-form-select>
            </b-form-group>
            </div>

                <b-form-group id="streetName-group" label="Nom de la voie (*)" label-for="streetName">
                  <b-form-input
                    id="streetName"
                    name="streetName"
                    v-model="$v.form.streetName.$model"
                    :state="validateState('streetName')"
                    aria-describedby="input-streetName-live-feedback"
                    trim
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-streetName-live-feedback">Veuillez saisir le nom de la voie.</b-form-invalid-feedback>
                </b-form-group>


                <b-form-group id="streetComplement-group" label="Complément d'adresse" label-for="streetComplement">
                  <b-form-input
                    id="streetComplement"
                    name="streetComplement"
                    v-model="$v.form.streetComplement.$model"
                    trim
                  ></b-form-input>
                </b-form-group>

              <div class="form-row">
                <b-form-group id="zipCode-group" label="Code postal (*)" label-for="zipCode" class="col-md-3 mr-3">
                  <b-form-input
                    id="zipCode"
                    name="zipCode"
                    v-model="$v.form.zipCode.$model"
                    :state="validateState('zipCode')"
                    aria-describedby="input-zipCode-live-feedback"
                    trim
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-zipCode-live-feedback">Veuillez saisir le code postal.</b-form-invalid-feedback>
                </b-form-group>


                <b-form-group id="city-group" label="Commune (*)" label-for="city" class="col-md-6">
                  <b-form-input
                    id="city"
                    name="city"
                    v-model="$v.form.city.$model"
                    :state="validateState('city')"
                    aria-describedby="input-city-live-feedback"
                    trim
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-city-live-feedback">Veuillez saisir la commune.</b-form-invalid-feedback>
                </b-form-group>
              </div>
          <div class="text-center">
            <hr>
            <b-icon id="nationality-adresse" icon="arrow-left-circle" class="arrow-style rounded p-2" variant="secondary" @click="back"></b-icon>
              <b-popover target="nationality-adresse" triggers="hover" placement="top" variant="primary">
                  Précédent: Nationalité.
              </b-popover>
            <b-icon v-if="isAdressValid" id="information-contact-adresse" icon="arrow-right-circle" class="arrow-style rounded p-2" variant="secondary" @click="next"></b-icon>
              <b-popover v-if="isAdressValid" target="information-contact-adresse" triggers="hover" placement="top" variant="primary">
                  Suivant: Informations de contact.
              </b-popover>

          </div>            

      </b-container>
    </b-form>
</template>

<script>
import Vue from "vue"
import { validationMixin } from "vuelidate"
import { required, minLength, alphaNum, alpha, numeric, maxLength, email, sameAs } from "vuelidate/lib/validators"
import mixinForm from "~/mixins/mixinForm"

import MandatoryFields from "~/components/commons/utils/MandatoryFields";
import ErrorFields from "~/components/commons/utils/ErrorFields";

export default Vue.extend({
  name: "Adresse",
  mixins: [validationMixin, mixinForm],
  props:["stepForm"],
  components: {MandatoryFields, ErrorFields},
  data() {
    return {
      alerteAdress: null,
      form: {
        streetNumber: null,
        streetExtension: null,
        streetType: null,
        streetName: null,
        streetComplement: null,
        zipCode: null,
        city: null,
      }
    }
  },
  validations: {
    form: {
      streetNumber: {         
        numeric
      },
      streetExtension: {         
      },
      streetType: {         
      },
      streetName: { 
        required
      },
      streetComplement: {         
      },
      zipCode: { 
        required,
        alphaNum
      },
      city: { 
        required
      },
    },
  },
  mounted() {
    if (this.stepForm)
      this.form = this.stepForm;
  },
  computed: {
    isAdressValid(){
      if( this.form.streetName && this.form.zipCode && this.form.city){
        this.alerteAdress = null
        return true
      }
      
      this.alerteAdress = []
      if(!this.form.streetName)
        this.alerteAdress.push('Rue non renseignée.')

      if(!this.form.zipCode)
        this.alerteAdress.push('Code postal non renseigné.')

      if(!this.form.city)
        this.alerteAdress.push('Ville non renseignée.')

      return false
    },
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    back() {
      this.$emit("backStepNationality", this.form);
    },
    next() {
      this.$emit("stepAdressDone", this.form);
    },
  }
})
</script>