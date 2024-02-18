<template>
  <div class="AccountPaymentModule py-4 py-lg-16" :class="getBorderColor">
    <header class="container p-0 mb-4" :class="getTextColor">
      <p class="text-24 text-center font-weight-light mb-2">
        {{ $t('payment.title') }}
      </p>
      <p class="text-16 text-center font-weight-light">
        {{ $t('payment.subtitle') }}
      </p>
      <div class="d-flex mx-auto justify-content-center my-4">
        <div v-for="img, imgIndex in $t('payment.images')" :key="imgIndex" class="d-flex justify-content-center mx-2">
          <img :src="require(`assets/images/credit_cards/${img}.png`)" width="100%" style="max-width: 50px;">
        </div>
      </div>
    </header>
    <div id="stripeCard" ref="stripeCard" class="text-24 text-primary mx-auto bg-grey p-2 p-md-4 rounded-lg" style="max-width: 460px" />
    <div class="mt-4 d-flex justify-content-center">
      <div v-if="!isLoading" class="d-flex align-items-center justify-content-between">
        <CommonsButton
          v-if="hasBackButton"
          class="mr-2"
          :content="{ title: 'Retour', bgColor: 'white', textColor: 'text-primary', }"
          @click.native="$emit('previous')"
        />
        <CommonsButton :content="{ ...$t('payment.button'), title: `${$t('payment.button.title')} ${amount} €`, loading: isLoading, disabled: isDisabled }" @click.native="sendPayment" />
      </div>
      <CommonsLoader v-else color="primary" size="36" />
    </div>
  </div>
</template>

<script>
import { forEach } from 'lodash'
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import FormMixin from '@/mixins/FormMixin'
import UserMixin from '@/mixins/UserMixin'
import constants from '@/constants'

export default {
  mixins: [ColorsMixin, ErrorMixin, FormMixin, UserMixin],
  props: {
    hasBackButton: {
      type: Boolean,
      default: false
    },
    hasForm: {
      type: Object,
      default: () => {}
    },
    hasOrigin: {
      type: String,
      default: ''
    },
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      amount: 0,
      card: undefined,
      clientSecret: undefined,
      constants,
      isDisabled: false,
      isLoading: false,
      isModule: true,
      isStripeLoaded: false,
      stripeSession: undefined,
      personaTest: {},
      paymentDetails: [],
      publicKey: undefined
    }
  },
  watch: {
    currentStep: {
      async handler (n) {
        if (n) {
          await this.getPrice()
        }
      }
    }
  },
  mounted () {
    this.getPrice()
  },
  methods: {
    buildCard () {
      /* eslint-disable-next-line */
      this.stripeSession = Stripe(this.publicKey)
      this.card = this.stripeSession.elements().create('card', {
        style: {
          base: {
            iconColor: this.getColors.primary,
            color: '#3f68b4',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '18px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
              color: '#3f68b4'
            },
            '::placeholder': {
              color: '#3f68b4'
            }
          },
          invalid: {
            iconColor: '#e80e0e',
            color: '#e80e0e'
          }
        }
      })
      this.card.mount('#stripeCard')
    },
    formatDocumentType (value) {
      switch (value) {
        case 'id':
          return 'Carte d\'identité'
        case 'passeport':
          return 'Passeport'
        case 'permis':
          return 'Permis'
        case 'sejour':
          return 'Carte de séjour'
        default:
          return 'Inconnu'
      }
    },
    buildFullUserData () {
      return {
        type: this.userTypeValue,
        description: this.description,
        personType: this.hasForm.personType,
        documentType: this.mapValueToText(this.getDocumentTypes, this.hasForm.documentType),
        passeportReason: this.mapValueToText(this.getPassportReasons, this.hasForm.passeportReason),
        idCardReason: this.mapValueToText(this.getCidReasons, this.hasForm.idCardReason),
        documentNumber: this.hasForm.documentNumber,
        oldDocumentPossession: this.hasForm.oldDocumentPossession,
        authority: this.hasForm.authority,
        dateDeliverance: this.hasForm.dateDeliverance,
        dateExpiration: this.hasForm.dateExpiration,
        departement: this.mapValueToText(this.getDepartments, this.hasForm.departement),
        sexe: this.hasForm.sexe,
        lastname: this.hasForm.lastname,
        lastname2: this.hasForm.lastname2,
        lastnameOrigine: this.hasForm.lastnameOrigine,
        prefixeLastname: this.hasForm.prefixeLastname,
        prefixeLastnameValue: this.hasForm.prefixeLastnameValue,
        firstname: this.hasForm.firstname,
        firstname2: this.hasForm.firstname2,
        firstname3: this.hasForm.firstname3,
        heigth: this.hasForm.heigth,
        eyesColor: this.hasForm.eyesColor,
        birthdate: this.hasForm.birthdate,
        birthCountryPlace: this.hasForm.birthCountryPlace,
        birthDepartementPlace: this.mapValueToText(this.departements, this.hasForm.birthDepartementPlace),
        birthCityPlace: this.hasForm.birthCityPlace,
        father: this.hasForm.father,
        fatherLastname: this.hasForm.fatherLastname,
        fatherFirstname: this.hasForm.fatherFirstname,
        fatherFirstname2: this.hasForm.fatherFirstname2,
        fatherFirstname3: this.hasForm.fatherFirstname3,
        fatherBirthdate: this.hasForm.fatherBirthdate,
        fatherBirthdateAreaPlace: this.hasForm.fatherBirthdateAreaPlace,
        fatherBirthdateCountryPlace: this.hasForm.fatherBirthdateCountryPlace,
        fatherNationality: this.hasForm.fatherNationality,
        mother: this.hasForm.mother,
        motherLastname: this.hasForm.motherLastname,
        motherFirstname: this.hasForm.motherFirstname,
        motherFirstname2: this.hasForm.motherFirstname2,
        motherFirstname3: this.hasForm.motherFirstname3,
        motherBirthdate: this.hasForm.motherBirthdate,
        motherBirthdateAreaPlace: this.hasForm.motherBirthdateAreaPlace,
        motherBirthdateCountryPlace: this.hasForm.motherBirthdateCountryPlace,
        motherNationality: this.hasForm.motherNationality,
        nationality: this.mapValuesToText(this.getNationalityOptions, this.hasForm.nationality),
        streetNumber: this.hasForm.streetNumber,
        streetExtension: this.hasForm.streetExtension,
        streetType: this.hasForm.streetType,
        streetName: this.hasForm.streetName,
        streetComplement: this.hasForm.streetComplement,
        zipCode: this.hasForm.zipCode,
        city: this.hasForm.city,
        phoneNumber: this.hasForm.phoneNumber,
        email: this.hasForm.email,
        lockDocument: this.hasForm.lockDocument,
        terms: this.hasForm.terms,
        amount: this.amount.toString(),
        paymentDetails: this.paymentDetails
      }
    },
    getPrice () {
      let finalPrice = 39.00 // minimum
      if (!this.hasForm) {
        return finalPrice
      }
      if (this.hasOrigin === constants.DECLARATION_PERTE) {
        this.amount = constants.PRICES.DECLARATION_PERTE
      }
      if (this.hasOrigin === constants.RENOUVELLEMENT) {
        const persona = {
          personType: this.hasForm.personType,
          documentType: this.hasForm.documentType,
          reason: this.hasForm.documentType === 'Carte_Identite' ? this.hasForm.idCardReason : this.hasForm.passeportReason,
          oldDocumentPossession: this.hasForm.oldDocumentPossession,
          lockDocument: this.hasForm.lockDocument
        }
        persona.reason = persona.reason !== 'Premiere_demande' ? 'Renouvellement' : 'Premiere_demande'
        const grid = {
          Adulte: {
            Passeport: {
              Premiere_demande: constants.PRICES.HIGH,
              Renouvellement: constants.PRICES.HIGH
            },
            Carte_Identite: {
              Premiere_demande: constants.PRICES.MIN,
              Renouvellement: constants.PRICES.MIN
            }
          },
          Mineur_Plus_15: {
            Passeport: {
              Premiere_demande: constants.PRICES.MEDIUM,
              Renouvellement: constants.PRICES.MEDIUM
            },
            Carte_Identite: {
              Premiere_demande: constants.PRICES.MIN,
              Renouvellement: constants.PRICES.MIN
            }
          },
          Mineur_Moins_15: {
            Passeport: {
              Premiere_demande: constants.PRICES.LOW,
              Renouvellement: constants.PRICES.LOW
            },
            Carte_Identite: {
              Premiere_demande: constants.PRICES.MIN,
              Renouvellement: constants.PRICES.MIN
            }
          }
        }
        forEach(grid, (x, i) => {
          if (i === persona.personType) {
            finalPrice = x[persona.documentType][persona.reason]
          }
        })
        let oldDocumentPrice = constants.PRICES.NULL
        if (persona.reason !== 'Premiere_demande' && persona.documentType !== 'Passeport') {
          // If no document, we have to pay timbre
          oldDocumentPrice = this.hasForm.oldDocumentPossession === 'Non' ? constants.PRICES.TIMBRE : constants.PRICES.NULL
        }
        const lockDocumentPrice = this.hasForm.lockDocument ? constants.PRICES.XMIN : constants.PRICES.NULL
        this.amount = (finalPrice + lockDocumentPrice + oldDocumentPrice).toFixed(2)
      }
      this.getPaymentIntent()
    },
    mapValueToText (values, value) {
      if (!values || !value) {
        return ''
      }
      for (let i = 0; i < values.length; i++) {
        if (value === null) {
          return ''
        }
        if (values[i].value === value) {
          return values[i].text
        }
      }
      return ''
    },
    mapValuesToText (values, choices) {
      let result = ''
      for (let i = 0; i < values.length; i++) {
        if (choices === null) {
          return ''
        }
        for (let j = 0; j < choices.length; j++) {
          if (choices[j] === values[i].value) {
            result += values[i].text + '. '
          }
        }
      }
      return result
    },
    async saveLostDocuments () {
      this.isLoading = true
      await this.$api.documents.saveLostDocument(this.getCurrentUser.type, this.hasForm.reason, this.hasForm.idNumber, this.hasForm.id, this.hasForm.pv, this.hasForm.docType)
        .then(() => {
          this.$toast.success(this.$t('success.lostDocument')).goAway(10000)
          let notifContent= `Vous avez déclaré la perte de votre ${this.formatDocumentType(this.hasForm.docType)} portant le numéro #${this.hasForm.idNumber}#. Ce document est mis en opposition au sein de notre réseau partenaire.`
          this.sendNotification(this.getCurrentUser.type, constants.DECLARATION_PERTE, constants.PORTAIL,  notifContent)
          this.$emit('success')
        })
        .catch(({ response }) => {
          if (response.status === 413) {
            this.$toast.error(this.$t('errors.upload.413')).goAway(10000)
          } else {
            this.$toast.error(response.data.error || this.$t('errors.common')).goAway(10000)
          }
        })
        .finally(() => { this.isLoading = false })
    },
    redirect() {
      let url = "";
      if (this.getCurrentUser.type === "individual") {
        url = `/particuliers/espace-client`;
      } else if (this.getCurrentUser.type === "partner") {
        url = `/professionnels/espace-client`;
      }
      this.$router.push(url);
    },
    async getPaymentIntent () {
      const data = {
        amount: this.amount,
        currency: 'eur',
        description: this.hasOrigin || constants.DECLARATION_PERTE,
        statement_descriptor: this.hasOrigin || constants.DECLARATION_PERTE
      }

      this.isLoading = true
      await this.$api.payment.getPaymentIntent(data)
        .then(({ clientSecret, publicKey }) => {
          if (clientSecret && publicKey) {
            this.clientSecret = clientSecret
            this.publicKey = publicKey
            this.buildCard()
          }
        })
        .catch(() => {
          this.$toast.error(this.$t('errors.common')).goAway(10000)
        })
        .finally(() => { this.isLoading = false })
    },
    async sendPayment () {
      this.isLoading = true
      const { paymentIntent, error } = await this.stripeSession.confirmCardPayment(this.clientSecret, {
        payment_method: { card: this.card }
      })
      if (error) {
        this.$toast.error(error.message).goAway(10000)
      }
      if (paymentIntent) {
        if (this.hasOrigin === constants.DECLARATION_PERTE) {
          if (!this.hasForm) {
            this.$toast.error('Absence de fichiers dans votre requête.').goAway(10000)
            return
          }
          await this.saveLostDocuments()
          setTimeout(() => {
            this.redirect()
          }, 2000)
        } else {
          if (this.getCurrentUser) {
            await this.$api.payment.emailAfterPayment(this.getCurrentUser.type, this.amount)
              .catch(({ response }) => {
                this.$toast.error(response.data.error).goAway(10000)
              })
          } else {
            await this.$api.payment.emailAfterPaymentAnonymous(this.hasForm.email, this.amount)
              .catch(({ response }) => {
                this.$toast.error(response.data.error).goAway(10000)
              })
          }
          this.sendForm(paymentIntent)
        }
      }
      this.isLoading = false
    },
    async registerNewUser () {
      return await this.$api.user.register({
        email: this.hasForm.email,
        firstname: this.hasForm.firstname,
        lastname: this.hasForm.lastname,
        password: this.hasForm.password,
        type: this.isPro
      })
    },
    async sendForm () {
      if (this.hasOrigin === constants.RENOUVELLEMENT) {
        const fullUserData = this.buildFullUserData()
        if (this.getCurrentUser) {
          await this.$api.renew.sendRenew(this.getCurrentUser.type, { ...fullUserData, paymentDetails: this.paymentDetails })
            .then(() => {
              this.sendNotification(this.getCurrentUser.type, constants.RENOUVELLEMENT, constants.PORTAIL, `vous avez fait une demande le ${this.$moment().format('DD/MM/YYYY')}.`)
              this.$emit('success')
            })
            .catch(({ response }) => {
              this.$toast.error(this.$t(response.data.error)).goAway(10000)
            })
        } else {
          // create account for user
          this.isLoading = true
          await this.registerNewUser()
            .then(({ success }) => {
              this.$toast.success(success).goAway(10000)
            })
            .catch(({ response }) => {
              return this.$toast.error(response.data.error).goAway(10000)
            })
            .finally(() => { this.isLoading = false })
          // send renew
          await this.$api.renew.sendRenewAnon({ ...fullUserData, paymentDetails: this.paymentDetails })
            .then(() =>
              this.$emit('success')
            )
            .catch(({ response }) => {
              return this.$toast.error(this.$t(response.data.error)).goAway(10000)
            })
            .finally(() => { this.isLoading = false })
        }
      }
    }
  }
}
</script>
