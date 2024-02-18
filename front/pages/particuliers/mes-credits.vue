<style>
.optionMenu{
  max-width: 100px;
} 
.optionItem{
  color: #000; 
} 
.btn-group > .btn:not(:first-child), .btn-group > .btn-group:not(:first-child){
  min-width: 35px !important;
}
 
.modal-footer{
  background: #fff !important;
}
.btn-secondary{
  min-width: 65px;
  color: #fff;
  background-color: #3F51B5;
  border-color: #3F51B5;
}
.btn-secondary:disabled {
    color: #fff !important;
    background-color: #bfbfbf !important;
    border-color: #bfbfbf !important;
}
.deleteIcon{
  width: 30px;
  height: 30px;
  margin-right: 12px;
}
</style>
<template>
  <div class="Account blue-theme">
    <div id="requests_detail" class="my-5 section area-content">
      <div class="container-fluid p-0">
        
          <div class="row col-12 col-md-10 col-lg-10 offset-lg-1">
            <div class="p-1" style="margin-top: 35px;">
              <h3 class="raleway fw-400">
                Il vous reste {{ this.getCurrentUser.credits }} crédits de vérification
              </h3>
            </div>
          </div>
     
        
        <div id="Demandes">
          <div class="bg-blue top-ribbon">
            <span class="text-white">Mes crédits de vérification</span>
          </div> 
          <div class="add-document-ribbon d-flex justify-content-start">
            <router-link
              id="add_demand"
              to="/particuliers/acheter-credits"
              class="btn btn-pink" >
              Acheter des crédits
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
  </div>
</template>

<script>
import { getFollowedDocuments } from '../../api/followed-documents' 
import { updateStateDocument } from '../../api/followed-documents' 
import UserMixin from '../../mixins/UserMixin'
import MessagesMixin from '../../mixins/MessagesMixin'
import ErrorMixin from '../../mixins/ErrorMixin' 
import { getUserCurrentPayments } from "../../api/credits"
import constants from '@/constants'

export default {
  name: 'AreaContent',
  mixins: [UserMixin, MessagesMixin, ErrorMixin],
  middleware: 'auth',
  data () {
    return {
      password:"",
      selectedOption: null,
      options: [
        { text: 'Masquer', disabled:true },
        { text: 'Démasquer', disabled:true },
        { text: 'Bloquer', disabled:true },
        { text: 'Supprimer', disabled:false },
      ],
      documentToDelete: null,
      stateDocToSelected:null, 
      folder: [],
      requests_header: [
        {
          text: '',
          align: 'center',
          sortable: true,
          value: 'status'
        },
        {
          text: 'Numéro',
          align: 'start',
          sortable: false,
          value: 'number'
        },
        { text: 'Date', value: 'date', sortable: true },
        {
          text: 'Document',
          value: 'document',
          sortable: false
        },
        {
          text: 'Suivi',
          value: 'isFollowed',
          sortable: false
        },
        { 
          text: '', 
          value: 'options', 
          sortable: false 
        }
      ],
      documents_header: [
        { text: '', align: 'start' },
        { text: 'Date', value: 'date', width: '20%', sortable: true },
        { text: 'Numéro', value: 'numero', width: '20%', sortable: true },
        { text: 'Document', value: 'typeDemande', width: '20%', sortable: true },
        { text: '', value: 'delete', sortable: false }
      ],
      payments_headers: [
        { text: '', align: 'start',  width: '9%' },
        { text: "Date", sortable: true, value: "createdAt", width: '20%' },
        { text: "Crédits", sortable: true, value: "addedCredits", width: '20%' },
        { text: "Prix", sortable: true, value: "amount", width: '20%' },
      ],
      requests: [],
      documents: [], 
      suiviDocuments:[], 
      selectedDocumentId:null,

      currentPayments: [],
      currentCredits: 0,
      amount: null,
      currentVerifications: [],
      notifContent:"", 
      docSelected:null
    }
  },
  computed: {   
    isValid () {  
      if (this.checkPassword(this.password) ) {
        return true
      }
    }
  },
  async mounted () { 
    this.init();
  },
  methods: {  
    async init(){
      this.fetchDocuments();
      this.getUserPayments();
      const lostDocuments = await this.fetchLostDocuments()
      const renewRequests = await this.fetchDemands()
      let followedDocuments = await getFollowedDocuments(this.getCurrentUser.type)
      followedDocuments = await followedDocuments.json()

      const allDemands = lostDocuments.concat(renewRequests)
      this.requests = followedDocuments.map((item) => {
        const demand = allDemands.find(e => e.numero === item.number)
        return { 
          status: demand ? demand.status || 'VAL' : 'VAL' ,
          number: item.number || item.id,
          type: item.type,
          date: this.$moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss'),
          document: item.type,
          createdAt: this.$moment(item.createdAt),
          isFollowed: item.locked,
          isMasked:true
        }
      }).sort((a, b) => (a.createdAt.isAfter(b.createdAt) ? 1 : -1)) 
      this.suiviDocuments = this.requests;  
    }, 
    showModalConfirmationWithPassword(doc, state){ 
      this.password =""; 
      this.docSelected = doc ;
      this.selectedDocumentId = state=='SUIVI'?doc.number:doc.numero;
      this.stateDocToSelected = state;  
      if(doc.isMasked==true){//unmask doc number
        this.$bvModal.show('confirmWithPassword'); 
      }else{//mask doc number
        if(state=="SUIVI"){ 
          let indexDoc = this.suiviDocuments.findIndex((item)=>item.number ==  this.selectedDocumentId);  
          this.suiviDocuments[indexDoc].isMasked = true; 
          this.notifContent  = `Vous avez choisi de masquer le numéro de votre document ${this.formatDocumentType(doc.type)} portant le numéro #${doc.number}#.`
        }else if(state=="PERTE"){
          let indexDoc = this.documents.findIndex((item)=>item.numero ==  this.selectedDocumentId);  
          this.documents[indexDoc].isMasked = true; 
          this.notifContent  = `Vous avez choisi de masquer le numéro de votre document ${this.formatDocumentType(doc.typeDemande)} portant le numéro #${doc.numero}#.` 
        } 
        this.sendNotification(this.getCurrentUser.type, constants.MASQUER_UN_DOCUMENT, this.getCurrentUser.id,  this.notifContent); 
      }
    },
    async unmaskDocumentNumber(){ 
      let body = {id:this.getCurrentUser.id, password:this.password, userType:this.getCurrentUser.type};   
      await this.$api.user.checkPassword(body).then((data) => {  
        if(this.stateDocToSelected=="SUIVI"){
          let indexDoc = this.suiviDocuments.findIndex((item)=>item.number === this.selectedDocumentId);
          this.requests[indexDoc].isMasked = false;
          this.notifContent  = `Vous avez affiché le numéro de votre  ${this.formatDocumentType(this.docSelected.type)} portant le numéro #${this.docSelected.number}#.`
        }else if(this.stateDocToSelected=="PERTE"){
          let indexDoc = this.documents.findIndex((item)=>item.numero === this.selectedDocumentId); 
          this.documents[indexDoc].isMasked = false; 
          this.notifContent  = `Vous avez affiché le numéro de votre  ${this.formatDocumentType(this.docSelected.typeDemande)} portant le numéro #${this.docSelected.numero}#.` 
        } 
        this.sendNotification(this.getCurrentUser.type, constants.DEMASQUER_UN_DOCUMENT, this.getCurrentUser.id, this.notifContent)
        this.$bvModal.hide('confirmWithPassword')  
      }).catch(async (error) => {   
        this.$bvModal.hide('confirmWithPassword')
        this.makeToast('Anomalie', "Mot de passe Incorrecte", 'danger')
      });  
    },
    showConfirmationModal(item, state) {  
      this.stateDocToSelected = state;   
      if(this.stateDocToSelected=='PERTE'){
        this.documentToDelete = item.numero;
      }else{
        this.documentToDelete = item.number;
      } 
      this.$bvModal.show('confirmDeleteDocument'); 
    },
    hideModal(refModal) {
        this.$bvModal.hide(refModal);
    },
    hideDocNumber(docNumber) { 
      return '*'.repeat(10) + docNumber.substring(docNumber.length - 2);
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
    dismissModale () {
      this.$bvModale.hide('delete_document_popup')
      this.documentToDelete = null
    },
    async deleteDocument (isLost) { 
      let body = {documentId:this.documentToDelete, state:this.stateDocToSelected, type:this.getCurrentUser.type}; 
      await this.$api.documents.deleteDocument(body).then((data) => {  
        this.$bvModal.hide('confirmDeleteDocument')
        //refresh list of document ( perte or suivi ) after delete document
        if(this.stateDocToSelected=='PERTE'){ 
          let indexDoc = this.documents.findIndex((item)=>item.numero == this.documentToDelete); 
          this.documents.splice(indexDoc, 1); 
        }else{ 
          let indexDoc = this.suiviDocuments.findIndex((item)=>item.number ==  this.documentToDelete); 
          this.suiviDocuments.splice(indexDoc, 1); 
        }
        this.documentToDelete = null 
        this.makeToast('Succès', data.message, 'success')
      }).catch(async (error) => { 
        this.documentToDelete = null 
        this.$bvModal.hide('confirmDeleteDocument')
        this.makeToast('Anomalie', "Anomalie technique survenue lors de la suppression de document", 'danger')
      });  
    }, 
     changeStateDocument(data){  
      let body = {number:data.number, locked:data.isFollowed, userType:this.getCurrentUser.type};  
      updateStateDocument(body).then((res) => {
        let indexDoc = this.suiviDocuments.findIndex((item)=>item.number ==  data.number);  
        this.suiviDocuments[indexDoc].isFollowed = !this.suiviDocuments[indexDoc].isFollowed; 
        this.makeToast('Succès', res.message, 'success'); 
        // send notification
        if(!data.isFollowed){
          this.notifContent  = `Vous avez verrouillé l’accès à votre ${this.formatDocumentType(data.type)} portant le numéro  #${data.number}#.`  
          this.sendNotification(this.getCurrentUser.type, constants.VERROUILLER_UN_DOCUMENT, this.getCurrentUser.id,  this.notifContent); 
        } else{
          this.notifContent  = `Vous avez déverrouillé l'accès à votre ${this.formatDocumentType(data.type)} portant le numéro #${data.number}#. Le mode ID Tracker est activé.`  
          this.sendNotification(this.getCurrentUser.type, constants.DEVERROUILLER_UN_DOCUMENT, this.getCurrentUser.id,  this.notifContent); 
        }
      }).catch(async (error) => { 
        this.makeToast('Anomalie', "Anomalie technique survenue lors de modification de document", 'danger')
      });   
    },
    selectDocumentToDelete (document) {
      this.dialogDelete = true
      this.documentToDelete = document
      this.$bvModal.show('delete_document_popup')
    },
    async fetchDocuments () { 
      const response = await this.$api.folders.getFolders(this.getCurrentUser.type)
      const folders = response

      const documents = await folders.reduce((current, folder) => {
        return current.concat(
          folder.documents.map(document => ({
            ...document,
            folder,
            date: this.$moment(document.createdAt)
              .format('DD/MM/YYYY hh:mm:ss')
          }))
        )
      }, []) 
      this.documents = this.documents.concat(documents) ; 
    },
    async fetchLostDocuments () {
      const response = await this.$api.documents.getLostDocuments(
        this.getCurrentUser.type
      )

      const json = response
      const format = json.results.map(item => ({
        ...item,
        requestType: 'Perte ou vol',
        date: this.$moment(item.createdAt).format('DD/MM/YYYY hh:mm:ss'),
        isMasked:true
      }))    
      this.documents = this.documents.concat(format) ; 
      return format
    },
    async fetchDemands () {
      const response = await this.$api.documents.getRenewDocuments(
        this.getCurrentUser.type
      )

      const json = response
      return json.results.map(item => ({
        ...item,
        requestType: 'Renouvellement'
      }))
    }, 
    async getUserPayments() {
      const response = await getUserCurrentPayments(this.getCurrentUser.type);  
      const json = await response.json();
      if (response.status !== 200) {
        return;
      } 
      this.currentPayments = json.payments.map((payment) => ({
        ...payment,
        createdAt: this.$moment(payment.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      }));
    }
  }
}
</script>