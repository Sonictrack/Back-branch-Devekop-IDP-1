<template>
  <div id="professionals_area" class="pink-theme">
    <section class="section__area bg__prink pt-100">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="raleway mt-0" style="color: white">
              {{ $t('account.header.title', { name: getCurrentUser.firstname + ' ' + getCurrentUser.lastname }) }}
            </h1>
            <h4 class="raleway font-weight-light">
              Bienvenue dans votre espace membre
            </h4>
            <p style="color: white;">
              Gérez vos demandes, téléchargez vos justificatifs et protégez vos
              documents.
            </p>
          </div>
          <div class="col-lg-5 ms-auto">
            <h3 class="raleway fw-600">
              Il vous reste
            </h3>
            <p style="color: white">
              {{ this.getCurrentUser.credits }} crédits vérification
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="b__list">
              <router-link to="/professionnels/verifier-document" class="btn btn-white">
                VÉRIFIEZ UN DOCUMENT
              </router-link>
              <router-link to="/professionnels/controler-document" class="btn btn-white">
                CONTRÔLER UN DOCUMENT
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section__area">
        <div class="row">
          <div class="col-md-12">
            <div class="container">
              <h1 class="font-weight-light mb-3 raleway text-uppercase">
                Vos vérifications ID <span class="text-uppercase">Protect</span>
              </h1>
              <p class="font-weight-light f-24">
                Retrouvez vos vérifcations et téléchargez vos justificatifs ID
              <span class="text-uppercase"> Protect.</span>
              </p>
            </div>
            <div class="table__box">
              <div class="table__title">
                <h2>Expertise Documentaire</h2>
              </div>
              <v-data-table
                :headers="verifications_headers"
                :items="currentVerifications"
                :items-per-page="5"
                class="custom-datatable requests-table mb-5"
              >
                <template #[`item.validity`]="{ item }">
                  <v-img  v-if="item.validity === 'OK'" :src="require('@/assets/images/icons/approved.png' )" max-height="30" max-width="30" />
                  <v-img  v-if="item.validity === 'ERROR'" :src="require('@/assets/images/icons/declined.png' )" max-height="30" max-width="30" />
                  <v-img  v-if="item.validity === 'WARNING'" :src="require('@/assets/images/icons/warning_doc.png' )" max-height="30" max-width="30" />
                </template>
                <template #[`item.url`]="{ item }">
                  <v-btn v-if="item.url !== null" class="link" small @click="getAnalysis(item.uid)">
                    Visualiser
                  </v-btn>
                </template>
                <template #[`item.status`]="{ item }"> 
                  <b-badge v-if="item.status == 'confirm'"  variant="success">Accepté</b-badge>
                  <b-badge v-if="item.status == 'reject'"  variant="danger">Refusé</b-badge>
                  <b-badge v-if="item.status == 'N/A' || item.status == 'requested'"  variant="dark">N/A</b-badge>
                </template>
              </v-data-table>
              <div class="table__footer">
                <router-link to="/professionnels/controler-document" class="btn btn-pink btn-secondary text-uppercase">
                  contrôlez <br>un document
                </router-link>
              </div>
            </div>
            <div class="table__box">
              <div class="table__title">
                <h2>Demandes</h2>
              </div>
              <div class="table__button container">
                <router-link
                  to="/professionnels/acheter-verifications"
                  class="btn btn-pink btn-secondary d-flex align-items-center"
                  style="width: 30% !important;"
                >
                <SolidPlusIcon width="30" />
                Demander des crédits
                </router-link>
              </div>
              <v-data-table
                :headers="payments_headers"
                :items="currentPayments"
                :items-per-page="5"
                class="custom-datatable requests-table mb-5"
              > 
              <template #[`item.addedCredits`]="{ item }">
                {{ item.addedCredits }} crédits vérification
              </template> 
              <template #[`item.amount`]="{ item }">
                {{ item.amount }} €
              </template> 
              </v-data-table>

            </div>
          </div>
        </div>
    </section>
  </div>
</template>

<script>
import { getUserCurrentPayments } from '../../api/credits'
import { getDocumentAnalysis, getUserCurrentVerifications } from '../../api/ariadnext'
import UserMixin from '../../mixins/UserMixin'
import ColorsMixin from '../../mixins/ColorsMixin'
import { getDocumentRequestList } from '../../api/documentrequests'

function formatIdType (type) {
  switch (type) {
    case 'ID':
      return "Carte d'identité"
    case 'P':
      return 'Passeport'
    case 'V':
      return 'Visa'
    case 'DL':
      return 'Permis de conduire'
    case 'HC':
      return 'Carte vitale'
    case 'RP':
      return 'Carte de séjour'

    default:
      return 'Inconnu'
  }
}

function formatValidity (validity) {
  switch (validity) {
    case 'ERROR':
      return 'Non conforme'
    case 'OK':
      return 'Conforme'
    case 'WARNING':
      return 'Expiré'
    default:
      return 'Inconnu'
  }
}

export default {
  mixins: [ColorsMixin, UserMixin],
  middleware: 'auth',
  data: () => ({
    verifications_headers: [
      { text: '', sortable: true, value: 'validity' },
      { text: 'Numéro', sortable: true, value: 'documentNumber' },
      { text: 'Date vérification', sortable: true, value: 'createdAt' },
      { text: 'Résultat', sortable: true, value: 'validityText' },
      { text: 'Document', sortable: true, value: 'idType' },
      { text: 'Statut', sortable: true, value: 'status' },
      { text: 'Rapport d\'expertise', sortable: false, value: 'url' },
    ],
    payments_headers: [
      { text: 'Date', sortable: true, value: 'createdAt' },
      { text: 'Crédits', sortable: true, value: 'addedCredits' },
      { text: 'Prix', sortable: true, value: 'amount' }
    ],

    currentCredits: 0,
    currentVerifications: [],
    currentPayments: []
  }),
  mounted () {
    Promise.all([
      this.getUserVerifications(),
      this.getUserPayments()
    ])
  },
  methods: { 
    redirect () {
      this.$router.replace('/professionnels/login')
    },
    async getUserVerifications () {
      const response = await getUserCurrentVerifications(
        this.getCurrentUser.type
      )

      const json = await response.json()
      if (response.status !== 200) {
        return
      }
      const maskDocNumber = (str) => {
        return '*'.repeat(10) + str.slice(-2)
      }
      const documentRequestsRequest = await getDocumentRequestList(this.getCurrentUser.type)
      const listJson = await documentRequestsRequest.json()

      this.currentVerifications = json.history.map((element) => {
        const documentRequest = listJson.requests.find(request => request.documentNumber === element.documentNumber)
        return {
          ...element,
          createdAt: this.$moment(element.createdAt).format('DD/MM/YYYY à hh:mm'),
          // url: element.ProtectIDPDFReport ? new Blob([new Uint8Array(element.ProtectIDPDFReport.data).buffer], { type: 'application/pdf' }) : null,
          url: element.documentNumber,
          idType: formatIdType(element.idType),
          validityText: formatValidity(element.validity),
          hasAuthorisation: documentRequest ? documentRequest.status === 'confirm' : false,
          documentNumber: maskDocNumber(element.documentNumber),
          status: documentRequest ? documentRequest.status:'N/A',
        }
      })
      // console.log('currentVerifications : ', this.currentVerifications)
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
      // console.log('getAnalysis json : ', json)
      if (!json.history.ProtectIDPDFReport) {
        return
      }

      this.openPdf(uid, new Blob([new Uint8Array(json.history.ProtectIDPDFReport.data).buffer], { type: 'application/pdf' }))
    },
    async getUserPayments () {
      const response = await getUserCurrentPayments(
        this.getCurrentUser.type
      )

      const json = await response.json()
      if (response.status !== 200) {
        return
      }

      this.currentPayments = json.payments.map(payment => ({ ...payment, createdAt: this.$moment(payment.createdAt).format('DD/MM/YYYY à hh:mm') }))
    },
    // async fetchAccount () {
    //   const response = await this.$api.auth.getUser(this.getCurrentUser.type)

    //   if (response.status === 401) {
    //     // this.logout()
    //     return
    //   }

    //   const json = await response.json()

    //   this.currentCredits = json.credits
    // },
    openPdf (name, blob) {
      const url = URL.createObjectURL(blob)
      window.open(url)
    }
  }
}
</script>
