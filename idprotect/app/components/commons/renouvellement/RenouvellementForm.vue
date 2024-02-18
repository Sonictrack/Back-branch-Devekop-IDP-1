<template>
  <b-container>
    <b-card header-bg-variant="info" bg-variant="light">
      <b-card bg-variant="light" border-variant="light" class="text-center">
        <b-card-text>
            <b-row>
              <b-col :class="classFormDone"><b>Formulaire</b></b-col>
              <b-col :class="classPaiementAccepted"><b>Paiement</b></b-col>
              <b-col :class="classAccountCreated"  v-if="!isLoggedIn"><b>Création de compte</b></b-col>
              <b-col :class="classFormSent"><b>Validation</b></b-col>
            </b-row>
            <hr>
          <b-row>
              <b-col><b-icon icon="file-earmark-text" scale="3" :variant="variantFormValid"></b-icon></b-col>
              <b-col><b-icon icon="credit-card" scale="3" :variant="variantPaiementAccepted"></b-icon></b-col>
              <b-col v-if="!isLoggedIn"><b-icon icon="person-circle" scale="3" :variant="variantAccountCreated"></b-icon></b-col>
              <b-col><b-icon icon="receipt" scale="3" :variant="variantFormSent"></b-icon></b-col>
          </b-row>
        </b-card-text>
      </b-card>
        <b-progress
          :variant="progressionVariant"
          show-progress
          animated
          :max="maxSteps"
        >
          <b-progress-bar :value="progression">
            <span
              ><strong>{{ progressionText }}</strong></span
            >
          </b-progress-bar>
        </b-progress>
      <div class="text-center mt-3">
        <b-col
          ><b-button
            variant="secondary"
            v-if="hideForm"
            @click="resetProgression"
            >Terminer</b-button
          ></b-col
        >
      </div>
      <b-tabs
        active-nav-item-class="font-weight-bold text-uppercase text-dark"
        card
        fill
        class="mt-3"
        v-if="!hideForm"
      >
        <b-tab title="Motif de la demande" v-if="isStepMotif">
          <Motif
            :stepForm="savedMotifForm"
            @stepMotifDone="nextStepEtatCivil"
          />
        </b-tab>
        <b-tab title="Etat civil" v-if="isStepEtatCivil">
          <EtatCivil
            :stepForm="savedEtatCivilForm"
            @backStepMotif="getBackToMotif"
            @stepEtatCivilDone="nextStepFiliation"
          />
        </b-tab>
        <b-tab title="Filiation" v-if="isStepFiliation">
          <Filiation
            :stepForm="savedFiliationForm"
            @backStepEtatCivil="getBackToEtatCivil"
            @stepFiliationDone="nextStepNationality"
          />
        </b-tab>
        <b-tab title="Nationalité" v-if="isStepNationality">
          <Nationality
            :stepForm="savedNationalityForm"
            @backStepFiliation="getBackToFiliation"
            @stepNationalityDone="nextStepAdress"
          />
        </b-tab>
        <b-tab title="Adresse" v-if="isStepAdress">
          <Adresse
            :stepForm="savedAdressForm"
            @backStepNationality="getBackToNationality"
            @stepAdressDone="nextStepContactInfo"
          />
        </b-tab>
        <b-tab title="Informations de contact" v-if="isStepContactInfo">
          <ContactInfo
            :stepForm="savedContactInfoForm"
            @backStepAdress="getBackToAdress"
            @stepContactInfoDone="nextStepRecap"
          />
        </b-tab>
        <b-tab title="Recapitulatif" v-if="isStepRecap">
          <Recapitulatif
            :stepForm="mergeAllForms"
            @backStepContactInfo="getBackToContactInfo"
            @stepRecapDone="nextStepPayment"
          />
        </b-tab>
        <b-tab title="Paiement" v-if="isStepPayment">
          <Paiement
            :amount="this.mergeAllForms.amount"
            :description="description"
            :emailPayment="this.mergeAllForms.email"
            @paymentSuccess="paymentSuccess"
            @nextStep="afterPayment"
          />
        </b-tab>
        <b-tab title="Justificatifs à fournir" v-if="!isStepPayment">
          <RenouvellementJustificatifs />
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
import Vue from "vue";
import Motif from "~/components/commons/renouvellement/Motif";
import EtatCivil from "~/components/commons/renouvellement/EtatCivil";
import Filiation from "~/components/commons/renouvellement/Filiation";
import Nationality from "~/components/commons/renouvellement/Nationality";
import Adresse from "~/components/commons/renouvellement/Adresse";
import ContactInfo from "~/components/commons/renouvellement/ContactInfo";
import Recapitulatif from "~/components/commons/renouvellement/Recapitulatif";
import RenouvellementJustificatifs from "~/components/commons/renouvellement/RenouvellementJustificatifs";
import Paiement from "~/components/commons/paiement/Paiement";
import { Action } from "~/components/enums/action";
import { userRegister } from "~/api/user";
import { renew, renewAnonymous } from "~/api/renouvellement";
import { UserType } from "~/components/enums/userType";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import mixinUser from '../../../mixins/mixinUser';

export default {
  name: "RenouvellementForm",
  components: {
    RenouvellementJustificatifs,
    Motif,
    EtatCivil,
    Filiation,
    Nationality,
    Adresse,
    ContactInfo,
    Recapitulatif,
    Paiement,
  },
  mixins: [mixinMessages, mixinUser],
  data() {
    return {
      motifStep: 1,
      etatCivilStep: 2,
      filiationStep: 3,
      nationalityStep: 4,
      adressStep: 5,
      contactInfoStep: 6,
      recapStep: 7,
      paymentStep: 8,
      accountStep: 9,
      notConnectedsendRecapStep: 10, 
      connectedsendRecapStep: 9, 
      progression: 1,
      textProgression: "",
      progressionVariant: "primary",
      isStepMotif: true,
      savedMotifForm: null,
      isStepEtatCivil: false,
      savedEtatCivilForm: null,
      isStepFiliation: false,
      savedFiliationForm: null,
      isStepNationality: false,
      savedNationalityForm: null,
      isStepAdress: false,
      savedAdressForm: null,
      isStepContactInfo: false,
      savedContactInfoForm: null,
      isStepRecap: false,
      mergeAllForms: null,
      isStepPayment: false,
      description: Action.RENOUVELLEMENT,
      userTypeValue: UserType.individual,
      hideForm: false,
      formDone: false,
      paiementAccepted: false,
      accountCreated: false,
      formSent: false,
      classFormDone: 'danger-text',
      classPaiementAccepted: 'danger-text',
      classAccountCreated: 'danger-text',
      classFormSent: 'danger-text',
    };
  },
  mounted(){
    if(this.$store.state.authentication.type)
      this.checkUser().then((result) => {
          if(!result)
            this.logout()
      })
  },
  computed: {
    maxSteps(){
      return this.$store.state.authentication.type !== null ? this.connectedsendRecapStep : this.notConnectedsendRecapStep
    },
    variantFormValid() {
      if(this.formDone){
        this.classFormDone = "success-text"
        return "success"
      }
      this.classFormDone = "danger-text"
      return "danger";
    },
    variantPaiementAccepted() {
      if(this.paiementAccepted){
        this.classPaiementAccepted = "success-text"
        return "success"
      }
      this.classPaiementAccepted = "danger-text"
      return "danger";
    },
    variantAccountCreated() {
      if(this.accountCreated){
        this.classAccountCreated = "success-text"
        return "success"
      }
      this.classAccountCreated = "danger-text"
      return "danger";
    },
    variantFormSent() {
      if(this.formSent){
        this.classFormSent = "success-text"
        return "success"
      }
      this.classFormSent = "danger-text"
      return "danger";
    },
    progressionText() {
      if (this.progression === this.maxSteps) {
        this.progressionVariant = "success";
        return "Démarche terminée !";
      }
      this.progressionVariant = "primary";
      return `Étape ${this.progression} sur ${this.maxSteps}`;
    },
    isLoggedIn() {
      return this.$store.state.authentication.type !== null
    },
  },
  methods: {
    nextStepEtatCivil(lastFormValue) {
      this.progression = this.etatCivilStep;
      this.isStepMotif = false;
      this.isStepEtatCivil = true;
      this.savedMotifForm = lastFormValue;
    },
    getBackToMotif(lastFormValue) {
      this.progression = this.motifStep;
      this.isStepMotif = true;
      this.isStepEtatCivil = false;
      this.savedEtatCivilForm = lastFormValue;
    },
    nextStepFiliation(lastFormValue) {
      this.progression = this.filiationStep;
      (this.isStepEtatCivil = false),
        (this.isStepFiliation = true),
        (this.savedEtatCivilForm = lastFormValue);
    },
    getBackToEtatCivil(lastFormValue) {
      this.progression = this.etatCivilStep;
      this.isStepEtatCivil = true;
      this.isStepFiliation = false;
      this.savedFiliationForm = lastFormValue;
    },
    nextStepNationality(lastFormValue) {
      this.progression = this.nationalityStep;
      (this.isStepFiliation = false),
        (this.isStepNationality = true),
        (this.savedFiliationForm = lastFormValue);
    },
    getBackToFiliation(lastFormValue) {
      this.progression = this.filiationStep;
      this.isStepFiliation = true;
      this.isStepNationality = false;
      this.savedNationalityForm = lastFormValue;
    },
    nextStepAdress(lastFormValue) {
      this.progression = this.adressStep;
      (this.isStepNationality = false),
        (this.isStepAdress = true),
        (this.savedNationalityForm = lastFormValue);
    },
    getBackToNationality(lastFormValue) {
      this.progression = this.nationalityStep;
      this.isStepNationality = true;
      this.isStepAdress = false;
      this.savedAdressForm = lastFormValue;
    },
    nextStepContactInfo(lastFormValue) {
      this.progression = this.contactInfoStep
      this.isStepAdress = false
      this.isStepContactInfo = true
      this.savedAdressForm = lastFormValue
    },
    getBackToAdress(lastFormValue) {
      this.progression = this.adressStep;
      this.isStepAdress = true;
      this.isStepContactInfo = false;
      this.savedContactInfoForm = lastFormValue;
    },
    nextStepRecap(lastFormValue) {
      this.progression = this.recapStep
      this.isStepContactInfo = false
      this.isStepRecap = true
      this.savedContactInfoForm = lastFormValue
      this.mergeAllForms = {
        ...this.savedMotifForm,
        ...this.savedEtatCivilForm,
        ...this.savedFiliationForm,
        ...this.savedAdressForm,
        ...this.savedNationalityForm,
        ...this.savedContactInfoForm,
      }
    },
    getBackToContactInfo() {
      this.progression = this.contactInfoStep;
      this.isStepContactInfo = true;
      this.isStepRecap = false;
    },
    nextStepPayment(lastFormValue) {
      this.progression = this.paymentStep
      this.mergeAllForms = { ...this.mergeAllForms, ...lastFormValue };
      this.isStepRecap = false
      this.formDone = true
      this.isStepPayment = true
    },
    getBackToRecap() {
      this.progression = this.recapStep;
      (this.isStepRecap = true), (this.isStepPayment = false);
      this.formDone = false;
    },
    paymentSuccess(){
      this.paiementAccepted = true
    },
    async afterPayment(payment) {
      try {

        if (payment) {
          this.paiementAccepted = true;

          if (!this.isLoggedIn) {
            const lightUserData = this.buildLightUserData();

            const responseRegister = await userRegister(lightUserData);
            if(responseRegister.status === 401)
              this.logout()

            const jsonRegister = await responseRegister.json();

            if (jsonRegister.error){
              throw new Error(jsonRegister.error);
            }

            this.makeToast('Succès', jsonRegister.success, TOAST_MESSAGE_VARIANT.SUCCESS);
       
            this.accountCreated = true;
            this.progression = this.accountStep;
          }

          const fullUserData = this.buildFullUserData();

          let responseRenew = null;          
          if (!this.isLoggedIn) {
            responseRenew = await renewAnonymous(fullUserData);
          } else {
            responseRenew = await renew(this.$store.state.authentication.type, fullUserData);
          }

          const jsonRenew = await responseRenew.json();

          if (jsonRenew.error){
            throw new Error(jsonRenew.error);
          }

          this.makeToast('Succès', jsonRenew.success, TOAST_MESSAGE_VARIANT.SUCCESS);
          this.progression = this.$store.state.authentication.type !== null ? this.connectedsendRecapStep : this.notConnectedsendRecapStep;
          this.formSent = true;
          this.hideForm = true;
          this.resetFormValues();
        } else {
          this.getBackToRecap();
        }
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    buildLightUserData() {
      return {
        type: this.userTypeValue,
        lastname: this.mergeAllForms.lastname,
        firstname: this.mergeAllForms.firstname,
        email: this.mergeAllForms.email,
        password: this.mergeAllForms.password,
      };
    },
    buildFullUserData() {
      return {
        type: this.userTypeValue,
        description: this.description,
        personType: this.mergeAllForms.personType,
        documentType: this.mapValueToText(this.documentTypes, this.mergeAllForms.documentType),
        passeportReason: this.mapValueToText(this.passeportReasons, this.mergeAllForms.passeportReason),
        idCardReason: this.mapValueToText(this.idCardReasons, this.mergeAllForms.idCardReason),
        documentNumber: this.mergeAllForms.documentNumber,
        oldDocumentPossession: this.mergeAllForms.oldDocumentPossession,
        authority: this.mergeAllForms.authority,
        dateDeliverance: this.mergeAllForms.dateDeliverance,
        dateExpiration: this.mergeAllForms.dateExpiration,
        departement: this.mapValueToText(this.departements,this.mergeAllForms.departement),
        sexe: this.mergeAllForms.sexe,
        lastname: this.mergeAllForms.lastname,
        lastname2: this.mergeAllForms.lastname2,
        lastnameOrigine: this.mergeAllForms.lastnameOrigine,
        prefixeLastname: this.mergeAllForms.prefixeLastname,
        prefixeLastnameValue: this.mergeAllForms.prefixeLastnameValue,
        firstname: this.mergeAllForms.firstname,
        firstname2: this.mergeAllForms.firstname2,
        firstname3: this.mergeAllForms.firstname3,
        heigth: this.mergeAllForms.heigth,
        eyesColor: this.mergeAllForms.eyesColor,
        birthdate: this.mergeAllForms.birthdate,
        birthCountryPlace: this.mapValueToText(this.birthCountryPlaces, this.mergeAllForms.birthCountryPlace),
        birthDepartementPlace: this.mapValueToText(this.departements, this.mergeAllForms.birthDepartementPlace),
        birthCityPlace: this.mergeAllForms.birthCityPlace,
        father: this.mergeAllForms.father,
        fatherLastname: this.mergeAllForms.fatherLastname,
        fatherFirstname: this.mergeAllForms.fatherFirstname,
        fatherFirstname2: this.mergeAllForms.fatherFirstname2,
        fatherFirstname3: this.mergeAllForms.fatherFirstname3,
        fatherBirthdate: this.mergeAllForms.fatherBirthdate,
        fatherBirthdateAreaPlace: this.mergeAllForms.fatherBirthdateAreaPlace,
        fatherBirthdateCountryPlace: this.mergeAllForms.fatherBirthdateCountryPlace,
        fatherNationality: this.mergeAllForms.fatherNationality,
        mother: this.mergeAllForms.mother,
        motherLastname: this.mergeAllForms.motherLastname,
        motherFirstname: this.mergeAllForms.motherFirstname,
        motherFirstname2: this.mergeAllForms.motherFirstname2,
        motherFirstname3: this.mergeAllForms.motherFirstname3,
        motherBirthdate: this.mergeAllForms.motherBirthdate,
        motherBirthdateAreaPlace: this.mergeAllForms.motherBirthdateAreaPlace,
        motherBirthdateCountryPlace: this.mergeAllForms.motherBirthdateCountryPlace,
        motherNationality: this.mergeAllForms.motherNationality,
        nationality: this.mapValuesToText(this.nationalityOptions, this.mergeAllForms.nationality),
        streetNumber: this.mergeAllForms.streetNumber,
        streetExtension: this.mergeAllForms.streetExtension,
        streetType: this.mergeAllForms.streetType,
        streetName: this.mergeAllForms.streetName,
        streetComplement: this.mergeAllForms.streetComplement,
        zipCode: this.mergeAllForms.zipCode,
        city: this.mergeAllForms.city,
        phoneNumber: this.mergeAllForms.phoneNumber,
        email: this.mergeAllForms.email,
        lockDocument: this.mergeAllForms.lockDocument,
        terms: this.mergeAllForms.terms,
        amount: this.mergeAllForms.amount,
        paymentDetails: this.mergeAllForms.paymentDetails
      };
    },
    resetFormValues() {
      (this.isStepMotif = true),
        (this.savedMotifForm = null),
        (this.isStepEtatCivil = false),
        (this.savedEtatCivilForm = null),
        (this.isStepFiliation = false),
        (this.savedFiliationForm = null),
        (this.isStepNationality = false),
        (this.savedNationalityForm = null),
        (this.isStepAdress = false),
        (this.savedAdressForm = null),
        (this.isStepContactInfo = false),
        (this.savedContactInfoForm = null),
        (this.isStepRecap = false),
        (this.isStepPayment = false),
        (this.mergeAllForms = null),
        (this.description = Action.RENOUVELLEMENT),
        (this.userTypeValue = UserType.individual);
    },
    resetProgression() {
      (this.progression = this.motifStep),
        (this.textProgression = ""),
        (this.maxSteps),
        (this.progressionVariant = "primary"),
        (this.hideForm = false),
        (this.formDone = false);
      (this.paiementAccepted = false),
        (this.accountCreated = false),
        (this.formSent = false),
        this.classFormDone = 'danger-text',
        this.classPaiementAccepted = 'danger-text',
        this.classAccountCreated = 'danger-text',
        this.classFormSent = 'danger-text'
    },
  },
};
</script>

<style>
.arrow-style {
  font-size: 3.5rem;
  cursor: pointer;
}
.success-text {
  color: #339D24;
}
.danger-text {
  color: #e60000;
}
.box-shadow{
  box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);
  border-color: coral;
}
</style>
