<template>
    <b-form class="mt-3">
      <b-container>
          <ErrorFields :isFormValid="isMotifValid" :alertFields="alerteMotif"/>
          <MandatoryFields/>
          <hr />
              <div class="form-row">
                <b-form-group
                  id="personType-group"
                  label="La demande concerne un"
                  label-for="personType"
                >
                  <b-form-radio-group
                    id="personType"
                    name="personType"
                    v-model="$v.form.personType.$model"
                    :options="personTypes"
                    buttons
                    button-variant="outline-secondary"
                    @change="onChangePersonType()"
                    class="mr-3"
                    size="sm"
                  ></b-form-radio-group>
                </b-form-group>

                <b-form-group
                  id="documentType-group"
                  label="Le document concerné est un(e)"
                  label-for="documentType"
                >
                  <b-form-radio-group
                    id="documentType"
                    name="documentType"
                    v-model="$v.form.documentType.$model"
                    :options="documentTypes"
                    buttons
                    button-variant="outline-secondary"
                    size="sm"
                  ></b-form-radio-group>
                </b-form-group>
              </div>

              <b-form-group
                id="passeportReason-group"
                label="Préciser la raison (*)"
                label-for="passeportReason"
                v-if="isPasseport"
              >
                <b-form-select
                  id="passeportReason"
                  name="passeportReason"
                  v-model="$v.form.passeportReason.$model"
                  :options="passeportReasons"
                  :state="validateState('passeportReason')"
                  aria-describedby="passeportReason-live-feedback"
                ></b-form-select>
                <b-form-invalid-feedback id="passeportReason-live-feedback"
                  >Veuillez préciser la raison.</b-form-invalid-feedback
                >
              </b-form-group>

              <b-form-group
                id="idCardReason-group"
                label="Préciser la raison (*)"
                label-for="idCardReason"
                v-if="isIdCard"
              >
                <b-form-select
                  id="idCardReason"
                  name="idCardReason"
                  v-model="$v.form.idCardReason.$model"
                  :options="idCardReasons"
                  :state="validateState('idCardReason')"
                  aria-describedby="idCardReason-live-feedback"
                ></b-form-select>
                <b-form-invalid-feedback id="idCardReason-live-feedback"
                  >Veuillez préciser la raison.</b-form-invalid-feedback
                >
              </b-form-group>

              <b-form-group
                id="departement-group"
                label="Département où se fera la demande (*)"
                label-for="departement"
              >
                <b-form-select
                  id="departement"
                  name="departement"
                  v-model="$v.form.departement.$model"
                  :options="departements"
                  :state="validateState('departement')"
                  aria-describedby="departement-live-feedback"
                ></b-form-select>
                <b-form-invalid-feedback id="departement-live-feedback"
                  >Veuillez selectionner un
                  département.</b-form-invalid-feedback
                >
              </b-form-group>
              <div class="form-row">
                <b-form-group
                  id="documentNumber-group"
                  label="N° de la pièce (*)"
                  label-for="documentNumber"
                  class="col-md-3 mr-3"
                  v-if="!hideDocumentNumber"
                >
                  <b-form-input
                    id="documentNumber"
                    name="documentNumber"
                    v-model="$v.form.documentNumber.$model"
                    :state="validateState('documentNumber')"
                    aria-describedby="input-documentNumber-live-feedback"
                    trim
                    :maxlength="documentNumberMaxLength"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    id="input-documentNumber-live-feedback"
                  >
                    Veuillez saisir le numéro du document à renouveler.
                  </b-form-invalid-feedback>
                  <b-popover
                    target="documentNumber-group"
                    triggers="hover"
                    placement="top"
                    variant="primary"
                  >
                    {{`Le numéro doit avoir entre ${documentNumberMinLength} et ${documentNumberMaxLength} caractères.`}}
                  </b-popover>  
                </b-form-group>

                <b-form-group
                  id="oldDocumentPossession-group"
                  label="Je suis en possession du document"
                  label-for="oldDocumentPossession"
                  class="col-md-6"
                  v-if="!hideDocumentNumber && !this.isPasseport"
                >
                  <b-form-radio-group
                    id="oldDocumentPossession"
                    name="oldDocumentPossession"
                    v-model="$v.form.oldDocumentPossession.$model"
                    :options="yesNo"
                    buttons
                    button-variant="outline-secondary"
                  ></b-form-radio-group>
                </b-form-group>
              </div>
              <div class="form-row">
                <b-form-group
                  id="authority-group"
                  label="Autorité ayant délivré la pièce (*)"
                  label-for="authority"
                  class="col-md-6"
                >
                  <b-form-input
                    id="authority"
                    name="authority"
                    v-model="$v.form.authority.$model"
                    :state="validateState('authority')"
                    aria-describedby="input-authority-live-feedback"
                    trim
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-authority-live-feedback">
                    Veuillez saisir l'autorité ayant délivré le document.
                  </b-form-invalid-feedback>
                </b-form-group>
              </div>

              <div class="form-row">
                <b-form-group
                  id="dateDeliverance-group"
                  label="Date de délivrance (*)"
                  label-for="dateDeliverance"
                  class="col-md-3 mr-3"
                >
                  <b-form-input
                    id="dateDeliverance"
                    name="dateDeliverance"
                    type="date"
                    v-model="$v.form.dateDeliverance.$model"
                    :state="validateState('dateDeliverance')"
                    aria-describedby="input-dateDeliverance-live-feedback"
                    onkeydown="return false"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    id="input-dateDeliverance-live-feedback"
                    >Veuillez renseigner la date de
                    délivrance.</b-form-invalid-feedback
                  >
                </b-form-group>

                <b-form-group
                  id="dateExpiration-group"
                  label="Date d'expiration (*)"
                  label-for="dateExpiration"
                  class="col-md-3"
                >
                  <b-form-input
                    id="dateExpiration"
                    name="dateExpiration"
                    type="date"
                    v-model="$v.form.dateExpiration.$model"
                    :state="validateState('dateExpiration')"
                    aria-describedby="input-dateExpiration-live-feedback"
                    onkeydown="return false"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    id="input-dateExpiration-live-feedback"
                    >Veuillez renseigner la date
                    d'expiration.</b-form-invalid-feedback
                  >
                </b-form-group>
              </div>
              <div class="text-center">
                <hr />
                <div v-if="isMotifValid">       
                  <b-icon
                  id="etat-civil-motif"
                  icon="arrow-right-circle"
                  class="arrow-style rounded p-2"
                  variant="secondary"
                  @click="checkDocumentNumberExist"
                ></b-icon>
                <b-popover
                  target="etat-civil-motif"
                  triggers="hover"
                  placement="top"
                  variant="primary"
                >
                  Suivant: Etat civil.
                </b-popover>
                </div>
              </div>
      </b-container>
    </b-form>
</template>

<script>
import Vue from "vue";
import { getLockDocument, getLockDocumentAnonymous } from "~/api/lockdocument"
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
import MandatoryFields from "~/components/commons/utils/MandatoryFields";
import ErrorFields from "~/components/commons/utils/ErrorFields";
import { UserType } from "../../enums/userType";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

export default Vue.extend({
  name: "Motif",
  mixins: [validationMixin, mixinForm, mixinMessages],
  props:["stepForm"],
  components: {MandatoryFields, ErrorFields},
  data() {
    return {
      adulte: "Adulte",
      passeport: "Passeport",
      documentNumberMinLength: 9,
      documentNumberMaxLength: 12,
      alerteMotif: null,
      form: {
        personType: "Adulte",
        documentType: "Passeport",
        passeportReason: null,
        idCardReason: null,
        departement: null,
        documentNumber: null,
        oldDocumentPossession: null,
        authority: null,
        dateDeliverance: null,
        dateExpiration: null,
      },
    };
  },
  validations: {
    form: {
      personType: {},
      documentType: {},
      passeportReason: {
        required,
      },
      idCardReason: {
        required,
      },
      departement: {
        required,
      },
      documentNumber: {
        required,
        minLength: minLength(9),
        maxLength: maxLength(12),
        alphaNum,
      },
      oldDocumentPossession: {},
      authority: {
        required,
      },
      dateDeliverance: {
        required,
      },
      dateExpiration: {
        required,
      },
    },
  },
  mounted(){
    if(this.stepForm)
      this.form = this.stepForm
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.authentication.type !== null
    },
    premiereDemande() {
      return (
        this.form.passeportReason === "Premiere_demande" ||
        this.form.idCardReason === "Premiere_demande"
      );
    },
    isPasseport() {
      if (this.form.documentType === "Passeport") {
        this.form.idCardReason = null;
        return true;
      }
      this.form.passeportReason = null;
      return false;
    },
    isIdCard() {
      if (this.form.documentType === "Carte_Identite") {
        this.form.passeportReason = null;
        return true;
      }
      this.form.idCardReason = null;
      return false;
    },
    hideDocumentNumber() {
      const resultPasseport = this.isPasseport && (!this.form.passeportReason || this.form.passeportReason === "Premiere_demande");
      const resultIdCard = this.isIdCard && (!this.form.idCardReason || this.form.idCardReason === "Premiere_demande");
      if (!resultPasseport && !resultIdCard) {
        this.form.oldDocumentPossession = "Oui";
      } else {
        this.form.oldDocumentPossession = null;
        this.form.documentNumber = null;
      }

      return resultPasseport || resultIdCard;
    },
    checkLengthDocumentNumber(){
      return this.form.documentNumber && this.form.documentNumber.length >=this.documentNumberMinLength && this.form.documentNumber.length <=this.documentNumberMaxLength    
    },
    isMotifValid() {
      if (
        (this.form.passeportReason || this.form.idCardReason) &&
        (this.form.passeportReason === "Premiere_demande" || 
        this.form.idCardReason === "Premiere_demande" ||
        ((this.form.passeportReason || this.form.idCardReason) && this.form.documentNumber && this.checkLengthDocumentNumber)) &&
        this.form.departement &&
        this.form.authority &&
        this.form.dateDeliverance &&
        this.form.dateExpiration
      ) {
        this.alerteMotif = null;
        return true;
      }

      this.alerteMotif = [];
      if (!this.form.passeportReason && !this.form.idCardReason)
        this.alerteMotif.push("Raison de la demande non renseignée.");

      if (!this.form.departement)
        this.alerteMotif.push("Département non renseigné.");

      if (!this.hideDocumentNumber && !this.checkLengthDocumentNumber)
        this.alerteMotif.push("Numéro de la pièce non renseigné ou incorrect.");

      if (!this.form.authority)
        this.alerteMotif.push("Autorité de délivrance non renseignée.");

      if (!this.form.dateDeliverance)
        this.alerteMotif.push("Date de délivrance non renseignée.");

      if (!this.form.dateExpiration)
        this.alerteMotif.push("Date d'expiration non renseignée.");

      return false;
    },
  },
  methods: {
    async checkDocumentNumberExist() {
      try {
        if(!this.premiereDemande){
          
          let response = null
          if (this.$store.state.authentication.type !== null)
            response = await getLockDocument(this.$store.state.authentication.type, this.form.documentNumber);
          else
            response = await getLockDocumentAnonymous(UserType.client, this.form.documentNumber);          

          const json = await response.json();
  
          if (json.error)
            throw new Error(json.error);
  
          if(!json.success)
            throw new Error(`Ce numéro de pièce est déjà déclaré n° ${this.form.documentNumber}.`);
        }

        this.next()
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    onChangePersonType() {
      this.form.documentType = "Passeport";
      this.form.passeportReason = null;
      this.form.idCardReason = null;
    },
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    next() {
      this.$emit("stepMotifDone", this.form);
    },
  },
})
</script>