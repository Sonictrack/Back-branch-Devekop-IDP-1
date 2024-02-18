<template>
  <div class="AccountFileCheck container p-2 p-lg-0" :class="{ 'my-4 my-lg-16' : !isModule }">
    <header v-if="!isModule" class="container p-0" :class="getTextColor">
      <h1 class="text-32 font-weight-light mb-4">
        {{ $t('account.check.title') }}
      </h1>
      <h2 class="text-24 font-weight-light mb-0">
        {{ $t('account.check.subtitle') }}
      </h2>
    </header>
    <div style="max-width: 800px;" class="mx-auto" :class="{ 'my-8' : !isModule }">
      <v-tabs v-model="activeTab" fixed-tabs>
        <v-tab v-for="option, optionIndex in $t('account.check.options')" :key="optionIndex" :class="activeTab === optionIndex ? getBorderColor + ' ' + getTextColor : 'bg-white'">
          <span :class="{ 'text-12' : isModule }">{{ $t(`general.${option.title}`) }}</span>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeTab" :class="[getBorderColor, getTextColor, isModule ? 'p-4 mt-2' : 'p-6 mt-4']">
        <div v-if="isLoading" class="d-flex flex-column align-items-center justify-content-center" style="min-height: 300px;">
          <p>Recherche en cours...</p>
          <CommonsLoader size="54" :color="getColors.secondary" />
        </div>
        <div v-else-if="result" class="d-flex flex-column justify-content-center align-items-center" style="min-height: 300px;">
          <div class="d-flex flex-column justify-content-center align-items-center text-center mx-auto" style="max-width: 500px;" :class="result.success ? 'text-success' : 'text-red'">
            <img
              v-if="result.success || result.not_found"
              src="@/assets/images/icons/success_icon.png"
              alt="ID Protect"
              width="150px"
              height="auto"
              class="mb-4"
            >
            <img
              v-else
              src="@/assets/images/icons/warning_icon.png"
              alt="ID PROTECT"
              width="150px"
              height="auto"
              class="mb-4"
            > 
            <p v-if="result.success" class="font-weight-bolder">
              A ce jour, ce document n’a pas été déclaré perdu/volé dans la base de données ID <span class="text-uppercase"> Protect</span>
            </p>
            <p v-if="result.error" class="font-weight-bolder">
              Attention, ce document a été déclaré perdu ou volé.<br>
              Nous vous conseillons de ne pas contractualiser avec ce client et prendre contact avec ID <span class="text-uppercase"> Protect</span>
            </p>
            <p v-if="result.locked" class="font-weight-bolder">
              Ce document est temporairement bloqué par son propriétaire. 
            </p>
            <p v-if="result.not_found" class="font-weight-bolder">
              A ce jour, ce document n’a pas été déclaré perdu/volé dans la base de données ID PROTECT. 
            </p>
          </div>
        </div>
        <div v-else class="d-flex justify-content-center mb-4">
          <img :src="require(`assets/images/cards/${getActiveTabContent.imgSrc}.png`)" width="100%" style="max-width: 500px;">
        </div>
        <div class="verify__body__input">
          <h2 v-if="!isModule" class="text-24 font-weight-light mb-0 w-100 text-center">
            {{ $t('account.check.documentNumber') }}
          </h2>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              v-if="getActiveTabContent"
              v-model="number"
              :maxlength="getActiveTabContent.type === 'passport' ? 9 : 12"
              class="centered-input"
              :color="getColors[getClassColor]"
              :placeholder="getActiveTabContent.placeholder"
              :rules="[() => !!number || 'Obligatoire',
                       v => checkValue(v, getActiveTabContent.type) || `Le numéro doit avoir au moins ${getActiveTabContent.type === 'permis' ? '6' : '9'}  ${getActiveTabContent.type === 'passport' ? 'caractères.' : 'caractères et maximum 12 caractères.'}`]"
              @input="sendNumber('newNumber', {
                idNumber: number, origin: 'idNumber', docType: getActiveTabContent.type
              })"
            />
          </v-form>

        </div>
        <div v-if="!isLoading" class="d-flex justify-content-center mt-4">
          <CommonsButton
            v-if="!isModule"
            :content="{ ...$t('account.check.button'), title: !isModule ? $t('account.check.button.title') : $t('declare.loggedIn.button.title'), bgColor: getClassColor, loading: isLoading, icon: !isModule ? 'solid-search-icon' : '', iconColor: 'white' }"
            @click.native="saveDocument"
          />
        </div>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import UserMixin from '@/mixins/UserMixin'
import constants from '@/constants'

export default {
  mixins: [ColorsMixin, ErrorMixin, UserMixin],
  props: {
    isModule: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      activeTab: 0,
      isLoading: undefined,
      limit: 9,
      number: undefined,
      result: undefined,
      valid: false
    }
  },
  computed: {
    getActiveTabContent () {
      return this.$t('account.check.options')[this.activeTab]
    }
  },
  watch: {
    activeTab: {
      handler () {
        this.isLoading = undefined
        this.number = undefined
        this.result = undefined
      }
    }
  },
  mounted () {
    if (this.getActiveTabContent) {
      this.limit = 9
    }
  },
  methods: {
    disallowLocation () {
      this.$toast.error("La recherche nécéssite d'autoriser la géolocalisation.").goAway(10000)
    },
    getLocation () {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    sendNumber (type, data) {
      this.$emit(type, { ...data, limit: this.limit })
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
    async saveDocument () {
      if (!this.$refs.form.validate()) {
        return
      }

      const position = {
        latitude: undefined,
        longitude: undefined,
        to: undefined,
        action: constants.RECHERCHE_ID
      }

      this.isLoading = true
      await this.getLocation()
        .then(({ coords }) => {
          position.latitude = coords.latitude
          position.longitude = coords.longitude
        })
        .catch(() => {
          this.$toast.error("La recherche nécéssite d'autoriser la géolocalisation.").goAway(10000)
        })
        .finally(() => {
          this.isLoading = false
        })

      if (!position.latitude && !position.longitude) {
        this.$toast.error("La géolocalisation n'a pas pu aboutir.").goAway(10000)
        return
      }

      let clientNumber
      this.result = undefined
      if (!this.number) {
        return
      }
      this.isLoading = true
      await this.$api.documents.searchLostDocument(this.getCurrentUser.type, this.getActiveTabContent.type, this.number)
        .then((data) => {
          this.result = data
          // send notification type recherche id
          if(data.docType && data.cardNumber){
            let notifContent = ""; 
            if(data.locked){
              notifContent= `Votre ${this.formatDocumentType(data.docType)} numéro #${data.cardNumber}# a été consulté par ${this.getCurrentUser.companyName}. Nous avons bloqué son utilisation.`
            }else{
              notifContent= `Votre ${this.formatDocumentType(data.docType)} numéro #${data.cardNumber}# a été consulté par ${this.getCurrentUser.companyName}.`
            }
            this.sendNotification(this.getCurrentUser.type, constants.RECHERCHE_ID, data.clientNumber,  notifContent)
          }
        })
        .catch(({ response }) => {
          if (response.data.clientNumber) {
            clientNumber = response.data.clientNumber
          }
          this.result = response.data.error
        })
        .finally(() => { this.isLoading = false })

      if (clientNumber) {
        position.to = clientNumber

        this.isLoading = false
        this.$api.user.recordPosition(this.getCurrentUser.type, position)
          .then(() => {
            this.sendNotification(this.getCurrentUser.type, constants.RECHERCHE_ID, clientNumber, `Document numéro ${this.number}`)
          })
          .catch(() => {
            this.$toast.error("La géolocalisation n'a pas pu aboutir.").goAway(10000)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>

<style scoped>
    .centered-input >>> input {
      text-align: center
    }
</style>
