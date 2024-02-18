<template>
  <div>
    <b-form class="mt-3">
      <b-container v-if="stepForm">          
            <h4><b-badge pill variant="secondary">Motif</b-badge></h4>
            <b-table-simple fixed hover striped small bordered caption-top responsive>
              <b-tbody>
                <b-tr><b-th>La demande concerne un:</b-th><b-td>{{mapValueToText(this.personTypes, stepForm.personType)}}</b-td></b-tr>
                <b-tr><b-th>Type de document:</b-th><b-td>{{mapValueToText(this.documentTypes, stepForm.documentType)}}</b-td></b-tr>
                <b-tr><b-th>Raison du renouvellement:</b-th><b-td>
                  {{mapValueToText(this.passeportReasons, stepForm.passeportReason)}} {{mapValueToText(this.idCardReasons, stepForm.idCardReason)}}
                </b-td></b-tr>
                <b-tr><b-th>N° de la pièce:</b-th><b-td>{{stepForm.documentNumber}}</b-td></b-tr>
                <b-tr><b-th>Je suis en possession du document:</b-th><b-td>{{stepForm.oldDocumentPossession}}</b-td></b-tr>
                <b-tr><b-th>Autorité de délivrance:</b-th><b-td>{{stepForm.authority}}</b-td></b-tr>
                <b-tr><b-th>Date de délivrance:</b-th><b-td>{{stepForm.dateDeliverance}}</b-td></b-tr>
                <b-tr><b-th>Date d'expiration:</b-th><b-td>{{stepForm.dateExpiration}}</b-td></b-tr>
                <b-tr><b-th>Département où se fera la demande:</b-th><b-td>{{mapValueToText(this.departements, stepForm.departement)}}</b-td></b-tr>
              </b-tbody>
            </b-table-simple>
            <hr>
            <h4><b-badge pill variant="secondary">Etat civil</b-badge></h4>
            <b-table-simple fixed hover striped  bordered small caption-top responsive>
            <b-tbody>
            <b-tr><b-th>Votre sexe:</b-th><b-td>{{stepForm.sexe}}</b-td></b-tr>
            <b-tr><b-th>Votre nom de naissance:</b-th><b-td>{{stepForm.lastname}}</b-td></b-tr>
            <b-tr><b-th>Votre second nom:</b-th><b-td>{{stepForm.lastname2}}</b-td></b-tr>
            <b-tr><b-th>Il s'agit du nom:</b-th><b-td>{{stepForm.lastnameOrigine}}</b-td></b-tr>
            <b-tr><b-th>Voulez-vous faire apparaître un mot devant le deuxième nom:</b-th><b-td>{{stepForm.prefixeLastname}}</b-td></b-tr>
            <b-tr><b-th>Si oui, lequel:</b-th><b-td>{{stepForm.prefixeLastnameValue}}</b-td></b-tr>
            <b-tr><b-th>Prénom:</b-th><b-td>{{stepForm.firstname}}</b-td></b-tr>
            <b-tr><b-th>Second prénom:</b-th><b-td>{{stepForm.firstname2}}</b-td></b-tr>
            <b-tr><b-th>Troisième prénom:</b-th><b-td>{{stepForm.firstname3}}</b-td></b-tr>
            <b-tr><b-th>Votre taille:</b-th><b-td>{{stepForm.heigth}} cm</b-td></b-tr>
            <b-tr><b-th>Couleur de vos yeux:</b-th><b-td>{{stepForm.eyesColor}}</b-td></b-tr>
            <b-tr><b-th>Votre date de naissance:</b-th><b-td>{{stepForm.birthdate}}</b-td></b-tr>
            <b-tr><b-th>Pays de naissance:</b-th><b-td>{{mapValueToText(this.birthCountryPlaces, stepForm.birthCountryPlace)}}</b-td></b-tr>
            <b-tr><b-th>Département de naissance:</b-th><b-td>{{mapValueToText(this.departements, stepForm.birthDepartementPlace)}}</b-td></b-tr>
            <b-tr><b-th>Ville de naissance:</b-th><b-td>{{stepForm.birthCityPlace}}</b-td></b-tr>
            </b-tbody>
            </b-table-simple>
            <hr>
            <h4><b-badge pill variant="secondary">Filiation > Père</b-badge></h4>
            <b-table-simple fixed hover striped bordered small caption-top responsive>
            <b-tbody>			
            <b-tr><b-th>Père inconnu?:</b-th><b-td>{{stepForm.father}}</b-td></b-tr>
            </b-tbody>
            <b-tbody v-if="stepForm.father==='Non'">	
            <b-tr><b-th>Son nom:</b-th><b-td>{{stepForm.fatherLastname}}</b-td></b-tr>
            <b-tr><b-th>Son prénom:</b-th><b-td>{{stepForm.fatherFirstname}}</b-td></b-tr>
            <b-tr><b-th>Son second prénom:</b-th><b-td>{{stepForm.fatherFirstname2}}</b-td></b-tr>
            <b-tr><b-th>Son troisième prénom:</b-th><b-td>{{stepForm.fatherFirstname3}}</b-td></b-tr>
            <b-tr><b-th>Sa date de naissance:</b-th><b-td>{{stepForm.fatherBirthdate}}</b-td></b-tr>
            <b-tr><b-th>Né en France ou à l'étranger?:</b-th><b-td>{{stepForm.fatherBirthdateAreaPlace}}</b-td></b-tr>
            <b-tr><b-th>Son pays de naissance:</b-th><b-td>{{stepForm.fatherBirthdateCountryPlace}}</b-td></b-tr>
            <b-tr><b-th>Sa nationalité:</b-th><b-td>{{stepForm.fatherNationality}}</b-td></b-tr>
            </b-tbody>
            </b-table-simple>
            <h4><b-badge pill variant="secondary">Filiation > Mère</b-badge></h4>
            <b-table-simple fixed hover striped bordered small caption-top responsive>
            <b-tbody>
            <b-tr><b-th>Mère inconnue?:</b-th><b-td>{{stepForm.mother}}</b-td></b-tr>
            </b-tbody>
            <b-tbody v-if="stepForm.mother==='Non'">	
            <b-tr><b-th>Son nom:</b-th><b-td>{{stepForm.motherLastname}}</b-td></b-tr>
            <b-tr><b-th>Son prénom:</b-th><b-td>{{stepForm.motherFirstname}}</b-td></b-tr>
            <b-tr><b-th>Son second prénom:</b-th><b-td>{{stepForm.motherFirstname2}}</b-td></b-tr>
            <b-tr><b-th>Son troisième prénom:</b-th><b-td>{{stepForm.motherFirstname3}}</b-td></b-tr>
            <b-tr><b-th>Sa date de naissance:</b-th><b-td>{{stepForm.motherBirthdate}}</b-td></b-tr>
            <b-tr><b-th>Née en France ou à l'étranger?:</b-th><b-td>{{stepForm.motherBirthdateAreaPlace}}</b-td></b-tr>
            <b-tr><b-th>Son pays de naissance:</b-th><b-td>{{stepForm.motherBirthdateCountryPlace}}</b-td></b-tr>
            <b-tr><b-th>Sa nationalité:</b-th><b-td>{{stepForm.motherNationality}}</b-td></b-tr>
            </b-tbody>
            </b-table-simple>
            <hr>
            <h4><b-badge pill variant="secondary">Nationalité du demandeur</b-badge></h4>
            <b-table-simple fixed hover striped bordered small caption-top responsive>
            <b-tbody>
            <b-tr><b-th>Vous êtes français(e) parce que:</b-th><b-td>{{mapValuesToText(this.nationalityOptions, stepForm.nationality)}}</b-td></b-tr>
            </b-tbody>
            </b-table-simple>
            <hr>
            <h4><b-badge pill variant="secondary">Adresse</b-badge></h4>
            <b-table-simple fixed hover striped bordered small caption-top responsive>
            <b-tbody>
            <b-tr><b-th>N° de la voie:</b-th><b-td>{{stepForm.streetNumber}}</b-td></b-tr>
            <b-tr><b-th>Extension:</b-th><b-td>{{stepForm.streetExtension}}</b-td></b-tr>
            <b-tr><b-th>Type de la voie:</b-th><b-td>{{stepForm.streetType}}</b-td></b-tr>
            <b-tr><b-th>Nom de la voie:</b-th><b-td>{{stepForm.streetName}}</b-td></b-tr>
            <b-tr><b-th>Complément d'adresse:</b-th><b-td>{{stepForm.streetComplement}}</b-td></b-tr>
            <b-tr><b-th>Code postal:</b-th><b-td>{{stepForm.zipCode}}</b-td></b-tr>
            <b-tr><b-th>Ville:</b-th><b-td>{{stepForm.city}}</b-td></b-tr>
            </b-tbody>
            </b-table-simple>
            <hr>
            <h4><b-badge pill variant="secondary">Informations de contact</b-badge></h4>
            <b-table-simple fixed hover striped bordered small caption-top responsive>
            <b-tbody>
            <b-tr><b-th>Téléphone mobile:</b-th><b-td>{{stepForm.phoneNumber}}</b-td></b-tr>
            <b-tr v-if="!isLoggedIn"><b-th>Email de contact:</b-th><b-td>{{stepForm.email}}</b-td></b-tr>
            </b-tbody>
            </b-table-simple>
            <PaiementDetail :paymentDetails="form.paymentDetails" :total="form.amount"/>

            <hr>
            <b-form-group
              id="lockDocument-group"
              label="Voulez-vous enregistrer votre ancien document dans la base des documents bloqués ID Protect?"
              label-for="lockDocument"
              v-if="!premiereDemande"
            >
              <b-form-checkbox v-model="$v.form.lockDocument.$model" name="lockDocument" switch>
                <b>: {{ $v.form.lockDocument.$model ? 'Oui' : 'Non' }}</b>
              </b-form-checkbox>
            </b-form-group>

            <b-form-group
              id="terms-group"
              label="Veuillez accepter les conditions générales d'utilisations."
              label-for="terms"
            >
              <b-form-checkbox 
                v-model="$v.form.terms.$model" 
                name="terms" 
                switch 
              >
                <b>: {{ $v.form.terms.$model ? 'Oui' : 'Non' }}</b>
              </b-form-checkbox>
            </b-form-group>
            
            <b-alert align="center" show v-if="totalAmount">
              <b-button type="submit" variant="success" :disabled="!$v.form.terms.$model" @click="next">Montant à régler : {{ totalAmount }} €</b-button>
            </b-alert>
            <div class="text-center">
              <hr>
              <b-icon id="information-contact-recapitulatif" icon="arrow-left-circle" class="arrow-style rounded p-2" variant="secondary" @click="back"></b-icon>
              <b-popover target="information-contact-recapitulatif" triggers="hover" placement="top" variant="primary">
                  Précédent: Informations de contact.
              </b-popover>
            </div>
      </b-container>
    </b-form>
  </div>
</template>

<script>
import Vue from "vue"
import { validationMixin } from "vuelidate"
import { required, minLength, number, alphaNum, alpha, numeric, maxLength, email, sameAs } from "vuelidate/lib/validators"
import { PRICE_RENEWAL } from "~/components/enums/price"
import { UserType } from "~/components/enums/userType"
import mixinForm from "~/mixins/mixinForm"
import PaiementDetail from "~/components/commons/paiement/PaiementDetail"

export default Vue.extend({
  name: "Recapitulatif",
  mixins: [validationMixin, mixinForm],
  components: { PaiementDetail },
  props:["stepForm"],
  data() {
    return {
      form: {
        lockDocument: false,
        terms: false,
        amount: 0,
        paymentDetails: []
      }
    }
  },
  validations: {
    form: {
      lockDocument: {
      },
      terms: {
        sameAs: sameAs( () => true )
      },
      amount:{
        number
      },
      paymentDetails:{
      }
    },
  },
  computed: {
    totalAmount(){
      this.form.paymentDetails = []
      this.mergePrices
      return this.form.amount
    },
    prestationIdProtect(){
      if(PRICE_RENEWAL.IDP_PRICE !== 0){
      this.form.paymentDetails.push({ detail: "Prestation ID Protect", amount: PRICE_RENEWAL.IDP_PRICE})
      }
      return PRICE_RENEWAL.IDP_PRICE
    },
    oldDocumentPrice(){
      const oldDocumentPrice = this.stepForm.oldDocumentPossession && this.stepForm.oldDocumentPossession === 'Non' ? PRICE_RENEWAL.ANCIEN_DOCUMENT_PERDU: 0
      if(oldDocumentPrice !== 0){
        this.form.paymentDetails.push({ detail: "Timbre fiscal", amount: oldDocumentPrice})
      }
      return oldDocumentPrice
    },
    lockDocumentPrice(){
      const lockDocumentPrice = this.form.lockDocument ? PRICE_RENEWAL.SAUVER_DOC_RENOUVELLEMENT: 0
      if(lockDocumentPrice !== 0){
        this.form.paymentDetails.push({ detail: "Enregistrer votre numéro dans notre base", amount: lockDocumentPrice})      
      }
      return lockDocumentPrice
    },
    documentPrice(){
      let documentPrice = 0
      if(this.stepForm.documentType === 'Passeport'){
        if(this.stepForm.personType === 'Adulte'){
          documentPrice = PRICE_RENEWAL.MAJEUR_PP
          } else if (this.stepForm.personType === 'Mineur_Moins_15'){
            documentPrice = PRICE_RENEWAL.MINEUR_MOINS_15_ANS_PP
          } else {
            documentPrice = PRICE_RENEWAL.MINEUR_PLUS_15_ANS_PP
          }
      }
      if(documentPrice !== 0){
        this.form.paymentDetails.push({ detail: "Timbre fiscal", amount: documentPrice})
      }
      return documentPrice
    },
    mergePrices(){
      const totalAmount = this.prestationIdProtect + this.oldDocumentPrice + this.lockDocumentPrice + this.documentPrice
      this.form.amount = parseFloat(totalAmount).toFixed(2)
      this.form.paymentDetails.push({ detail: "Montant total", amount: this.form.amount})
    },
    isLoggedIn(){
      return this.$store.state.authentication.type !== null
    },
    premiereDemande(){
      return this.stepForm.passeportReason === 'Premiere_demande' || this.stepForm.idCardReason === 'Premiere_demande'
    },
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    back() {
      this.$emit("backStepContactInfo");
    },
    next() {
      event.preventDefault()
      this.$emit("stepRecapDone", this.form);
    },
  }
})
</script>