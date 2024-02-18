<template>
  <div class="blue-theme">
    <section class="section__area border-bottom border-pink pb-2">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="hero__text">
              <h1>Bonjour, {{ getCurrentUser.firstname + ' ' + getCurrentUser.lastname }}</h1>
              <p>Il vous reste {{ getCurrentUser.credits }} Crédits de vérification</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section__area">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 class="font-weight-light mb-3 raleway text-uppercase">
              Controler un document
            </h1>
            <p class="font-weight-light f-24">
              Grâce à cet outil, vérifiez la conformité des documents qui vous
              sont présentés (Passeport, CNI, Permis de conduire, Titre de
              séjour)
            </p>
          </div>
        </div>
        <!-- <div v-if="analysisLoading" class="row">
          <div class="col-lg-8 mx-auto d-flex flex-column align-items-center">
            <b-spinner style="width: 5rem; height: 5rem; color: #BB298C !important;" variant="primary" label="Spinning" />
            <h4 class="mt-4">
              {{ textLoading }}
            </h4>
          </div>
        </div>
        <div v-else-if="lossLoading" class="row">
          <div class="col-lg-8 mx-auto d-flex flex-column align-items-center">
            <b-spinner style="width: 5rem; height: 5rem; color: #BB298C !important;" variant="primary" label="Spinning" />
            <h4 class="mt-4">
              Recherche dans les documents actuellement perdus
            </h4>
          </div>
        </div> -->
        <!-- <div v-else-if="!lossLoading && isDocumentLost" class="row">
          <div class="col-lg-8 mx-auto d-flex flex-column align-items-center">
            <img src="@/assets/images/icons/declined.png" alt="">
            <h4 class="mt-4">
              {{ error }}
            </h4>
          </div>
        </div> -->
        <!-- <div v-else-if="!lossLoading && isDocumentValid" class="row">
          <div class="col-lg-8 mx-auto d-flex flex-column align-items-center">
            <img src="@/assets/images/icons/approved.png" alt="">
            <h4 class="mt-4">
              <div class="text-center">
                {{ $t('account.check.response.success') }}
              </div>
            </h4>
            <br>
            <div class="text-center">
              <button class="btn btn-pink" @click="reset">
                Vérifier un autre document.
              </button>
            </div>
          </div>
        </div> -->
        <div v-if="fluxDataLoading" class="row">
          <div class="col-lg-8 mx-auto d-flex flex-column align-items-center">
            <!-- <img src="@/assets/images/icons/approved.png" alt=""> -->
            <!-- step 1 AriadNexts -->
            <div class="mt-4 text-center" v-if="currentStep>=0">
              {{ texts[0] }} {{ analysisLoading ? 'en cours' : '' }}
              <b-spinner v-if="analysisLoading" style="width: 1rem; height: 1rem; color: #BB298C !important;" variant="primary" label="Spinning" />

              <span v-if="currentStep >= 0">
                <img v-if="resultFluxData[0] && resultFluxData[0].error" src="@/assets/images/icons/declined.png" style="width: 1rem; height: 1rem;" alt="">
                <img v-if="resultFluxData[0] && !resultFluxData[0].error" src="@/assets/images/icons/approved.png" style="width: 1rem; height: 1rem;" alt="">
              </span>
              <br>
              <p v-if="resultFluxData[0]" style="color:#999b9e">
                {{ resultFluxData[0].message }}
              </p>
            </div>
            <br>
            <!-- step 2   serach loast document-->
            <div class="mt-4 text-center"  v-if="currentStep>0">
              {{ texts[1] }} {{ lossLoading ? 'en cours' : '' }}
              <b-spinner v-if="lossLoading" style="width: 1rem; height: 1rem; color: #BB298C !important;" variant="primary" label="Spinning" />
              <span v-if="currentStep > 0 && resultFluxData[1]">
                <img v-if="resultFluxData[1] && resultFluxData[1].error" src="@/assets/images/icons/declined.png" style="width: 1rem; height: 1rem;" alt="">
                <img v-if="resultFluxData[1] && !resultFluxData[1].error" src="@/assets/images/icons/approved.png" style="width: 1rem; height: 1rem;" alt="">
              </span>
              <br>
              <p v-if="currentStep > 1 && resultFluxData[1]" style="color:#999b9e">
                {{ resultFluxData[1].message }}
              </p>
            </div>
            <br>
            <!-- Step 3  send request to owner of document-->    
            <div class="mt-4 text-center" v-if="currentStep>1 && !isLostDocument">
              {{ texts[2] }} {{ isWaitingForHandshake ? 'en cours' : '' }}
              <b-spinner v-if="isWaitingForHandshake" style="width: 1rem; height: 1rem; color: #BB298C !important;" variant="primary" label="Spinning" />
              <span v-if="currentStep > 2" style="color:#999b9e">
                <!-- {{ resultFluxData[2].message }} -->
                <span v-if="isWaitingForHandshake" class="text-center mt-5">
                  <p style="color:#999b9e">
                    En attente de la confirmation du propriéraire du document
                  </p>
                </span>
                <span v-if="!isWaitingForHandshake && confirmed" class="mt-5 text-center">
                  <img src="@/assets/images/icons/approved.png" style="width: 1rem; height: 1rem;" alt="">
                  <p style="color:#999b9e">
                    Le propriétaire du document vous a autorisé à accéder à l'analyse de son document
                  </p>
                </span>
                <span v-else-if="!isWaitingForHandshake && rejected" class="text-center mt-5">
                  <img src="@/assets/images/icons/declined.png" style="width: 1rem; height: 1rem;" alt="">
                  <p style="color:#999b9e">
                    Le propriétaire du document à rejeté votre demande
                  </p>
                </span>
                <span v-else-if="!isWaitingForHandshake && !requestHandled" class="text-center mt-5">
                  <img src="@/assets/images/icons/approved.png" style="width: 1rem; height: 1rem;" alt="">
                  <p style="color:#999b9e">
                    Aucun utilisateur n'a été trouvé dans notre base de données pour confirmer votre demande.
                  </p>
                </span>
              </span>
            </div>
            <br>
            <div v-if="processEnded" class="text-center">
              <!-- <button class="btn btn-pink" @click="reset">
                Contrôler un autre document.
              </button> -->
              <!-- <button v-if="documentAnalyseUrl != undefined  && !isLostDocument" class="btn btn-pink" @click="openPdf(documentAnalyseUrl)">
                Voir le PDF.
              </button> -->
            </div>
            <!-- <div class="mt-4">
              <div class="text-center">
                {{ $t('account.check.response.success') }}
              </div>
            </div> -->
            <br>
          </div>
        </div>
        <div v-else-if="!isWaitingForHandshake" class="row">
          <div class="col-lg-8 mx-auto">
            <div class="verify__box border-0">
              <div class="button__list justify-content-around">
                <button :class="classes('recto')" class="text-uppercase" @click="() => type = 'recto'">
                  Recto
                </button>
                <button :class="classes('recto-verso')" class="text-uppercase" @click="() => type = 'recto-verso'">
                  Recto/verso
                </button>
              </div>
              <div class="document">
                <div class="row justify-content-center">
                  <div class="col-lg-6">
                    <div class="document__body">
                      <label for="file-1">
                        <font-awesome-icon icon="file-medical" />
                      </label>
                      <input id="file-1" type="file" hidden @change="onFile1Change">
                      <h3 class="document__title text-center">
                        {{ document1Name.length === 0? "Cliquez ici ajouter le recto de votre document": document1Name }}
                      </h3>
                    </div>
                  </div>
                  <div v-if="type === 'recto-verso'" class="col-lg-6">
                    <div class="document__body">
                      <label for="file-2">
                        <font-awesome-icon icon="file-medical" />
                      </label>
                      <input id="file-2" type="file" hidden @change="onFile2Change">
                      <h3 v-if="document2Name.length === 0" class="document__title">
                        {{ type === "recto"?
                          "Cliquez ici pour votre procès verbal":
                          "Cliquez ici pour ajouter le verso de votre document" }}
                      </h3>
                      <h3 v-else class="document__title text-center">
                        {{ document2Name }}
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <button class="btn btn-pink" @click="verify">
                    Vérifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getDocumentAnalysis, startAnalysis } from '../../api/ariadnext'
import constants, { UserType } from '../../constants'
import ErrorMixin from '../../mixins/ErrorMixin'
import MessagesMixin from '../../mixins/MessagesMixin'
import UserMixin from '../../mixins/UserMixin' 
import { handshake, sendDocumentRequest } from './../../api/documentrequests'

export default {
  middleware: 'auth',
  name: 'ControlDocument',
  mixins: [UserMixin, MessagesMixin, ErrorMixin],
  data () {
    return {
      credits: 0,
      isWaitingForHandshake: false,
      currentTimer: null,
      type: 'recto',
      document1: '',
      document1Name: '',
      document2: '',
      document2Name: '',
      currentStep: 0,
      isLostDocument: false,
      requestHandled: false,
      confirmed: false,
      rejected: false,
      processEnded: false,
      documentAnalyseUrl: undefined,

      error: '',
      resultFluxData: [],

      fluxDataLoading: false,
      analysisLoading: false,
      lossLoading: false,
      isDocumentLost: false,
      isDocumentValid: false,
      documentData:null,
      texts: [
        'Vérification du document...',
        'Consultation de la base ID PROTECT (documents perdus et volés)...',
        'Consultation ID Tracker (documents suivis)...'
      ],
      textLoading: "En attente de la fin de l'analyse du document..."
    }
  },
  mounted () {
    if (
      !this.isLoggedIn ||
      this.getCurrentUser.type !== UserType.individual
    ) {
      this.redirect()
    }
  },
  methods: {
    redirect () {
      this.$router.replace('/particuliers/login')
    },
    classes (btnType) {
      if (btnType === this.type) {
        return 'btn btn-pink text-uppercase'
      }

      return 'btn btn-border text-uppercase'
    },
    documentLoading () {
      let i = 0
      this.interval = setInterval(() => {
        this.textLoading = this.texts[(i = (i + 1) % this.texts.length)]
      }, 3000)
    },
    async verify () { 
      this.analysisLoading = true
      this.fluxDataLoading = true
      // this.requestHandled = true

      const response = await startAnalysis(
        this.getCurrentUser.type,
        this.document1,
        this.document2
      )
      this.documentLoading()
      const json = await response.json()
      this.documentData = json
      
      this.analysisLoading = false
      if (response.status !== 200) {
        this.makeToast('Anomalie', json.error ?? 'une erreur est survenue')
        this.resultFluxData = [{ message: `Anomalie, ${json.error ?? 'une erreur et survenue'}`, error: true }, { message: '', error: true }, { message: '', error: true }]
        return
      }


      if (json.validity === 'ERROR') { // || json.validity === 'WARNING'
        this.makeToast('Anomalie', 'Ce document n\'est pas conforme', 'danger')
        this.resultFluxData.push({ message: 'Anomalie Ce document n\'est pas conforme', error: true })
        this.processEnded = true;
        return
      } else if(json.validity === 'WARNING') {
        this.makeToast('Succès', 'Ce document est conforme mais expiré !', 'warning')
        this.resultFluxData.push({ message: 'Succès, ce document est conforme mais expiré !', error: false })
      }else{
        this.makeToast('Succès', 'Ce document est conforme !', 'success')
        this.resultFluxData.push({ message: 'Succès, ce document est conforme !', error: false })
      }
      this.currentStep = 1
      await this.getAnalysis(json.uid)

      if (json.clientNumber) { 
        let notifContent= `Votre ${json.type} numéro #${json.numero}# a fait l'objet d'un contrôle soumis à votre décision par (${this.getCurrentUser.firstname} ${this.getCurrentUser.lastname}) .`
        this.sendNotification(this.getCurrentUser.type, constants.ANALYSE, json.clientNumber, notifContent)
      }

      this.lossLoading = true
      await this.$api.documents.checkDocument(
        this.getCurrentUser.type,
        '',
        json.numero
      )
        .then((response) => {
          if (response) {
            if (response.success) {
              this.resultFluxData.push({ message: 'A ce jour, ce document n’a pas été déclaré perdu/volé dans la base de données ID PROTECT!', error: false })
            } else if (response.error || response.locked) {
              this.isLostDocument = true; 
              if(response.locked){ 
                this.resultFluxData.push({ message: 'Le titulaire du document a bloqué son usage temporairement.', error: true })
              }
              if(response.error){
                this.resultFluxData.push({ message: 'Attention, ce document a été déclaré perdu ou volé. Nous vous conseillons de ne pas contractualiser avec ce client et prendre contact avec ID PROTECT', error: true })
              }
              this.processEnded = true;
            }
          }
          this.lossLoading = false
          this.currentStep = 2
          this.isDocumentLost = false
          this.isDocumentValid = true
          // if doucment is lost or locked don't send request to owner
          if(!this.isLostDocument){
            this.handleDocumentRequest(json).then(() => {
              this.currentStep = 3
              this.processEnded = true;
              this.resultFluxData.push({ message: 'Succès, demande envoyée au propriétaire du document', error: false })
            }).catch(
              (error) => {
                this.makeToast('Anomalie', error.message, 'danger')
                this.resultFluxData.push({ message: `${error.message}`, error: true })
              }
            )
          }
          
        })
        .catch(({ response }) => {
          this.lossLoading = false
          this.isDocumentLost = true
          this.error = response.data.error
          this.resultFluxData.push({ message: `${response.data.error}`, error: true })
        })
    },

    async checkHandshake (idDocument) {
      const response = await handshake(
        this.getCurrentUser.type,
        idDocument
      )
      const json = await response.json()
      if (response.status !== 200) {
        return
      }

      if (json.request.status === 'confirm') {
        this.requestHandled = true
        this.confirmed = true
        this.rejected = false
        // send notif accept request
        let notifContent= `Vous avez donné votre consentement à une entrée en relation avec (${this.getCurrentUser.firstname} ${this.getCurrentUser.lastname}) sur présentation du/la ${this.documentData.type} numéro #${this.documentData.numero}#.`
        this.sendNotification(this.getCurrentUser.type, constants.DEMANDE_AUTORISATION_ACCEPTE, this.documentData.clientNumber, notifContent)
        // await this.getAnalysis(number)
        this.isWaitingForHandshake = false
        return
      }

      if (json.request.status === 'reject') {
        this.requestHandled = true
        this.confirmed = false
        this.rejected = true
        // send notif accept request
        let notifContent= `Vous avez refusé l'entrée en relation avec (${this.getCurrentUser.firstname} ${this.getCurrentUser.lastname}) sur présentation de/la ${this.documentData.type} numéro #${this.documentData.numero}#.`
        this.sendNotification(this.getCurrentUser.type, constants.DEMANDE_AUTORISATION_REFUSE, this.documentData.clientNumber, notifContent)
        this.isWaitingForHandshake = false
        // throw new Error('Le propriétaire du document a refusé la demande')
      }
    },

    async handleDocumentRequest (json) {
      const documentRequest = await this.createDocumentRequest(json.numero)
      if (documentRequest.message) {
        this.requestHandled = false
        this.isWaitingForHandshake = false
        // Redirect to the profile of the client
        return
      }

      this.isWaitingForHandshake = true

      const interval = setInterval(() => {
        if (!this.requestHandled) {
          this.checkHandshake(
            documentRequest.id
          )
        }
      }, 5000)

      const THREE_MINUTES_IN_MS = 3 * 60 * 1000
      this.currentTimer = setTimeout(() => {
        this.isWaitingForHandshake = false
        this.currentStep = 3
        clearInterval(interval)
        // send notif no response of request
        let notifContent= `Vous avez reçu une demande de mise en relation de (${this.getCurrentUser.firstname} ${this.getCurrentUser.lastname}) sur présentation de/la ${this.documentData.type} numéro #${this.documentData.numero}# à laquelle vous n'avez pas répondu.` 
        this.sendNotification(this.getCurrentUser.type, constants.DEMANDE_AUTORISATION_SANS_REPONSE, this.documentData.clientNumber, notifContent)
        this.requestHandled = false
      }, THREE_MINUTES_IN_MS)
    },

    async createDocumentRequest (number) {
      const response = await sendDocumentRequest(
        this.getCurrentUser.type,
        number
      )

      const json = response.json()

      return json
    },

    onFile1Change (event) {
      const { files } = event.target
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = (event) => {
        if (files.length > 0) {
          const imageTypes = ['image/png', 'image/jpeg', 'image/jfif'];
          if (imageTypes.includes(files[0].type) || files[0].type === 'application/pdf') {
            this.document1 = reader.result
            this.document1Name = files[0].name
          } else {
            this.makeToast('Anomalie', 'Fichier sélectionné invalide (jpeg, png, jfif ou pdf).' , 'danger')
          }
        }
      }
    },
    onFile2Change (event) {
      const { files } = event.target
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = (event) => {
        if (files.length > 0) {
          const imageTypes = ['image/png', 'image/jpeg', 'image/jfif'];
          if (imageTypes.includes(files[0].type) || files[0].type === 'application/pdf') {
            this.document2 = reader.result
            this.document2Name = files[0].name
          } else {
            this.makeToast('Anomalie', 'Fichier sélectionné invalide (jpeg, png, jfif ou pdf).', 'danger')
          }
        }
      }
    },
    async getAnalysis (uid) {
      const response = await getDocumentAnalysis(
        this.getCurrentUser.type,
        uid
      )

      const json = await response.json()
      if (response.status !== 200) {
        this.makeToast('Anomalie', json.error)
        return
      }
      
      const documentAnalyseBlob = new Blob([new Uint8Array(json.history.ProtectIDPDFReport.data).buffer], { type: 'application/pdf' })
      this.openPdf(uid, documentAnalyseBlob)
    },
    openPdf (name, blob) {
      if (this.documentAnalyseUrl === undefined) {
        this.documentAnalyseUrl = window.URL.createObjectURL(blob)
      }
      window.open(this.documentAnalyseUrl)
    },
    reset () {
      this.isWaitingForHandshake = false
      this.fluxDataLoading = false
      this.isDocumentValid = false
      this.analysisLoading = false
      this.lossLoading = false
      this.isDocumentLost = false
      this.document1 = ''
      this.document1Name = ''
      this.document2 = ''
      this.document2Name = ''
      this.currentTimer = null
      this.type = 'recto'
      this.error = ''
      this.resultFluxData = []
      this.requestHandled = false
      this.confirmed = false
      this.rejected = false
      this.currentStep = 0
      window.URL.revokeObjectURL(this.documentAnalyseUrl)
      this.documentAnalyseUrl = undefined
    }
  }
}
</script>
