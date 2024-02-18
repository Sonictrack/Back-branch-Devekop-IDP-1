<style>
.Account  {
padding-top: 40px;
}
.optionMenu {
  max-width: 100px;
}

.optionItem {
  color: #000;
}

.btn-group > .btn:not(:first-child),
.btn-group > .btn-group:not(:first-child) {
  min-width: 35px !important;
}

.modal-footer {
  background: #fff !important;
}

.btn-secondary {
  min-width: 65px;
  color: #fff;
  background-color: #3f51b5;
  border-color: #3f51b5;
}

.btn-secondary:disabled {
  color: #fff !important;
  background-color: #bfbfbf !important;
  border-color: #bfbfbf !important;
}

.deleteIcon {
  width: 30px;
  height: 30px;
  margin-right: 12px;
}
</style>
<template>
  <div class="Account blue-theme">
    <!-- <AccountHeader /> -->
    <!-- <AccountRequest id="Folders" />
    <AccountFolders /> -->
    <div id="requests_detail" class="my-5 section area-content">
      <div class="container-fluid p-0">
        <div class="row m-0">
          <div class="col-12 col-md-10 col-lg-10 offset-lg-1">
            <h1 class=" text-uppercase">
              Vos documents ID <span class="text-uppercase">Protect</span>
            </h1>
            <h3>
              ID Tracker : Retrouvez vos documents en suivi chez ID
              <span class="text-uppercase">Protect.</span>
            </h3>
          </div>
        </div>
        <div class="mt-5">
          <div class="bg-blue top-ribbon">
            <span class="text-white">Vos documents</span>
          </div>
          <v-data-table
            :headers="requests_header"
            :items="suiviDocuments"
            :items-per-page="5"
            class="custom-datatable requests-table mb-5"
          >
            <template #[`item.document`]="{ item }">
              {{ formatDocumentType(item.document) }}
            </template>
            <template #[`item.number`]="{ item }">
              {{
                item.isMasked == true ? hideDocNumber(item.number) : item.number
              }}
            </template>
            <template #[`item.isFollowed`]="{ item }">
              {{ item.isFollowed === false ? "Actif" : "Inactif" }}
            </template>
            <template #[`item.options`]="{ item }">
              <img
                class="deleteIcon"
                src="@/assets/images/icons/remove.png"
                v-b-tooltip.hover.v-primary
                title="Supprimer le Document"
                @click="showConfirmationModal(item, 'SUIVI')"
              />
              <img
                class="deleteIcon"
                v-if="item.isFollowed === false"
                src="@/assets/images/icons/openPadlock.png"
                v-b-tooltip.hover.v-primary
                title="Verrouiller Document"
                @click="changeStateDocument(item)"
              />
              <img
                class="deleteIcon"
                v-if="item.isFollowed === true"
                src="@/assets/images/icons/closedPadlock.png"
                v-b-tooltip.hover.v-primary
                title="Déverrouiller Document"
                @click="changeStateDocument(item)"
              />
              <img
                class="deleteIcon"
                v-if="item.isMasked === false"
                src="@/assets/images/icons/mask.png"
                v-b-tooltip.hover.top.v-primary="'Masquer le N° du document'"
                @click="showModalConfirmationWithPassword(item, 'SUIVI')"
              />
              <img
                class="deleteIcon"
                v-if="item.isMasked === true"
                src="@/assets/images/icons/unmask.png"
                v-b-tooltip.hover.top.v-primary="'Afficher le N° du document'"
                @click="showModalConfirmationWithPassword(item, 'SUIVI')"
              />
            </template>
            <template #[`item.status`]="{ item }">
              <v-img
                v-if="item.status === 'VAL'"
                :src="require('@/assets/images/icons/approved.png')"
                max-height="30"
                max-width="30"
              />
              <v-img
                v-if="item.status === 'EC'"
                :src="require('@/assets/images/icons/process.png')"
                max-height="30"
                max-width="30"
              />
              <v-img
                v-if="item.status === 'INFO'"
                :src="require('@/assets/images/icons/info.png')"
                max-height="30"
                max-width="30"
              />
              <v-img
                v-if="item.status === 'ANN'"
                :src="require('@/assets/images/icons/declined.png')"
                max-height="30"
                max-width="30"
              />
            </template>
          </v-data-table>

          <!-- modal confirmation remove document followed -->
          <b-modal
            id="confirmDeleteDocument"
            title="Suppression de Document En suivi"
            button-size="sm"
            :no-close-on-backdrop="true"
          >
            <p class="my-2" style="text-align: center">
              la suppression un document est une action irréversible! <br />
              Êtes-vous sûr de vouloir supprimer document ?
            </p>
            <template #modal-footer="{ ok, cancel }" class="footerModal">
              <b-button clas="modalBtn" size="sm" @click="deleteDocument()">
                OK
              </b-button>
              <b-button
                clas="modalBtn"
                size="sm"
                @click="hideModal('confirmDeleteDocument')"
              >
                Cancel
              </b-button>
            </template>
          </b-modal>

          <!-- modal confirmation with password -->
          <b-modal
            id="confirmWithPassword"
            title="Démasquer le Document"
            button-size="sm"
            :no-close-on-backdrop="true"
          >
            <p class="my-2" style="text-align: center">
              Pour démasquer le numéro de document, veuillez saisir votre mot de
              passe.
            </p>
            <form ref="form" v-on:submit.prevent>
              <b-form-group
                label="Mot de passe :"
                label-for="name-input"
                style="font-weight: 600; font-size: 14px; margin-top: 20px"
                invalid-feedback="Name is required"
              >
                <b-form-input
                  id="name-input"
                  type="password"
                  v-model="password"
                  @keyup.enter="unmaskDocumentNumber()"
                  required
                ></b-form-input>
              </b-form-group>
            </form>
            <template #modal-footer="{ ok, cancel }" class="footerModal">
              <b-button
                clas="modalBtn"
                size="sm"
                :disabled="!isValid"
                @click="unmaskDocumentNumber()"
              >
                OK
              </b-button>
              <b-button
                clas="modalBtn"
                size="sm"
                @click="hideModal('confirmWithPassword')"
              >
                Cancel
              </b-button>
            </template>
          </b-modal>

          <div class="add-document-ribbon d-flex justify-content-center">
            <router-link
              id="add_document"
              to="/particuliers/suivre-document"
              class="btn btn-pink"
            >
              Ajouter un document
            </router-link>
          </div>
          <!-- <b-modal
            id="delete_followed_popup"
            title="Voulez vous supprimer ce suivi ?"
            centered
          >
            <div>
              <h3>Attention.</h3>
              <p class="text-white">
                Supprimer un suivi est une action irréversible.
                <br />
                Êtes-vous sûr de vouloir supprimer ce suivi ?
              </p>
              <div class="form-group btn-group">
                <a
                  v-on:click.prevent="deleteFollowed()"
                  href="#"
                  class="btn btn-confirm-round mr-4"
                >
                  <img
                    src="@/assets/images/icons/check_btn_icon.png"
                    alt=""
                    class="img-fluid"
                  />
                </a>
                <a
                  v-on:click="dismissModale()"
                  href="#"
                  class="btn btn-cancel-round"
                >
                  <img
                    src="@/assets/images/icons/cancel_btn_icon.png"
                    alt=""
                    class="img-fluid"
                  />
                </a>
              </div>
            </div>
          </b-modal> -->
        </div>
        <div id="Folders">
          <div class="bg-blue top-ribbon">
            <span class="text-white">Vos documents mise en opposition</span>
          </div>
          <div class="warning-ribbon">
            <span class="icon">
              <img src="@/assets/images/icons/warning.png" alt="" />
            </span>
            <span>
              Ces documents seront automatiquement déclarés inactifs s’ils sont
              présentés aux partenaires d’ID
              <span class="text-uppercase">Protect</span>
            </span>
          </div>
          <div class="add-document-ribbon d-flex justify-content-start">
            <router-link
              id="add_document"
              to="/particuliers/perte-ou-vol"
              class="btn btn-pink"
            >
              Ajouter un document
            </router-link>
          </div>
          <v-data-table
            :headers="documents_header"
            :items="documents"
            :items-per-page="5"
            class="custom-datatable docs-table"
          >
            <template #[`item.numero`]="{ item }">
              {{
                item.isMasked == true ? hideDocNumber(item.numero) : item.numero
              }}
            </template>
            <template #[`item.typeDemande`]="{ item }">
              {{ formatDocumentType(item.typeDemande) }}
            </template>
            <template #[`item.delete`]="{ item }">
              <img
                class="deleteIcon"
                src="@/assets/images/icons/remove.png"
                v-b-tooltip.top.v-primary="'Supprimer le Document'"
                @click="showConfirmationModal(item, 'PERTE')"
              />
              <img
                class="deleteIcon"
                v-if="item.isMasked === false"
                src="@/assets/images/icons/mask.png"
                v-b-tooltip.top.v-primary="'Masquer le numéro du document'"
                @click="showModalConfirmationWithPassword(item, 'PERTE')"
              />
              <img
                class="deleteIcon"
                v-if="item.isMasked === true"
                src="@/assets/images/icons/unmask.png"
                v-b-tooltip.top.v-primary="'Afficher le numéro du document'"
                @click="showModalConfirmationWithPassword(item, 'PERTE')"
              />
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFollowedDocuments } from "../../api/followed-documents";
import { updateStateDocument } from "../../api/followed-documents";
import UserMixin from "../../mixins/UserMixin";
import MessagesMixin from "../../mixins/MessagesMixin";
import ErrorMixin from "../../mixins/ErrorMixin";
import { getUserCurrentPayments } from "../../api/credits";
import constants from "@/constants";

export default {
  name: "AreaContent",
  mixins: [UserMixin, MessagesMixin, ErrorMixin],
  middleware: "auth",
  data() {
    return {
      password: "",
      selectedOption: null,
      options: [
        { text: "Masquer", disabled: true },
        { text: "Démasquer", disabled: true },
        { text: "Bloquer", disabled: true },
        { text: "Supprimer", disabled: false },
      ],
      documentToDelete: null,
      stateDocToSelected: null,
      folder: [],
      requests_header: [
        {
          text: "",
          align: "center",
          sortable: true,
          value: "status",
        },
        {
          text: "Numéro",
          align: "start",
          sortable: false,
          value: "number",
        },
        { text: "Date", value: "date", sortable: true },
        {
          text: "Document",
          value: "document",
          sortable: false,
        },
        {
          text: "Suivi",
          value: "isFollowed",
          sortable: false,
        },
        {
          text: "",
          value: "options",
          sortable: false,
        },
      ],
      documents_header: [
        { text: "", align: "start" },
        { text: "Date", value: "date", width: "20%", sortable: true },
        { text: "Numéro", value: "numero", width: "20%", sortable: true },
        {
          text: "Document",
          value: "typeDemande",
          width: "20%",
          sortable: true,
        },
        { text: "", value: "delete", sortable: false },
      ],
      payments_headers: [
        { text: "", align: "start", width: "9%" },
        { text: "Date", sortable: true, value: "createdAt", width: "20%" },
        {
          text: "Crédits",
          sortable: true,
          value: "addedCredits",
          width: "20%",
        },
        { text: "Prix", sortable: true, value: "amount", width: "20%" },
      ],
      requests: [],
      documents: [],
      suiviDocuments: [],
      selectedDocumentId: null,

      currentPayments: [],
      currentCredits: 0,
      amount: null,
      currentVerifications: [],
      notifContent: "",
      docSelected: null,
    };
  },
  computed: {
    isValid() {
      if (this.checkPassword(this.password)) {
        return true;
      }
    },
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.fetchDocuments();
      this.getUserPayments();
      const lostDocuments = await this.fetchLostDocuments();
      const renewRequests = await this.fetchDemands();
      let followedDocuments = await getFollowedDocuments(
        this.getCurrentUser.type
      );
      followedDocuments = await followedDocuments.json();

      const allDemands = lostDocuments.concat(renewRequests);
      this.requests = followedDocuments
        .map((item) => {
          const demand = allDemands.find((e) => e.numero === item.number);
          return {
            status: demand ? demand.status || "VAL" : "VAL",
            number: item.number || item.id,
            type: item.type,
            date: this.$moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss"),
            document: item.type,
            createdAt: this.$moment(item.createdAt),
            isFollowed: item.locked,
            isMasked: true,
          };
        })
        .sort((a, b) => (a.createdAt.isAfter(b.createdAt) ? -1 : 1));
      this.suiviDocuments = this.requests;
    },

    showModalConfirmationWithPassword(doc, state) {
      this.password = "";
      this.docSelected = doc;
      this.selectedDocumentId = state == "SUIVI" ? doc.number : doc.numero;
      this.stateDocToSelected = state;
      if (doc.isMasked == true) {
        //unmask doc number
        this.$bvModal.show("confirmWithPassword");
      } else {
        //mask doc number
        if (state == "SUIVI") {
          let indexDoc = this.suiviDocuments.findIndex(
            (item) => item.number == this.selectedDocumentId
          );
          this.suiviDocuments[indexDoc].isMasked = true;
          this.notifContent = `Vous avez choisi de masquer le numéro de votre document ${this.formatDocumentType(
            doc.type
          )} portant le numéro #${doc.number}#.`;
        } else if (state == "PERTE") {
          let indexDoc = this.documents.findIndex(
            (item) => item.numero == this.selectedDocumentId
          );
          this.documents[indexDoc].isMasked = true;
          this.notifContent = `Vous avez choisi de masquer le numéro de votre document ${this.formatDocumentType(
            doc.typeDemande
          )} portant le numéro #${doc.numero}#.`;
        }
        this.sendNotification(
          this.getCurrentUser.type,
          constants.MASQUER_UN_DOCUMENT,
          this.getCurrentUser.id,
          this.notifContent
        );
      }
    },
    async unmaskDocumentNumber() {
      let body = {
        id: this.getCurrentUser.id,
        password: this.password,
        userType: this.getCurrentUser.type,
      };
      await this.$api.user
        .checkPassword(body)
        .then((data) => {
          if (this.stateDocToSelected == "SUIVI") {
            let indexDoc = this.suiviDocuments.findIndex(
              (item) => item.number === this.selectedDocumentId
            );
            this.requests[indexDoc].isMasked = false;
            this.notifContent = `Vous avez affiché le numéro de votre  ${this.formatDocumentType(
              this.docSelected.type
            )} portant le numéro #${this.docSelected.number}#.`;
          } else if (this.stateDocToSelected == "PERTE") {
            let indexDoc = this.documents.findIndex(
              (item) => item.numero === this.selectedDocumentId
            );
            this.documents[indexDoc].isMasked = false;
            this.notifContent = `Vous avez affiché le numéro de votre  ${this.formatDocumentType(
              this.docSelected.typeDemande
            )} portant le numéro #${this.docSelected.numero}#.`;
          }
          this.sendNotification(
            this.getCurrentUser.type,
            constants.DEMASQUER_UN_DOCUMENT,
            this.getCurrentUser.id,
            this.notifContent
          );
          this.$bvModal.hide("confirmWithPassword");
        })
        .catch(async (error) => {
          this.$bvModal.hide("confirmWithPassword");
          this.makeToast("Anomalie", "Mot de passe Incorrecte", "danger");
        });
    },
    showConfirmationModal(item, state) {
      this.stateDocToSelected = state;
      if (this.stateDocToSelected == "PERTE") {
        this.documentToDelete = item.numero;
      } else {
        this.documentToDelete = item.number;
      }
      this.$bvModal.show("confirmDeleteDocument");
    },
    hideModal(refModal) {
      this.$bvModal.hide(refModal);
    },
    hideDocNumber(docNumber) {
      return "*".repeat(10) + docNumber.substring(docNumber.length - 2);
    },
    formatDocumentType(value) {
      switch (value) {
        case "id":
          return "Carte d'identité";
        case "passeport":
          return "Passeport";
        case "permis":
          return "Permis";
        case "sejour":
          return "Carte de séjour";
        default:
          return "Inconnu";
      }
    },
    dismissModale() {
      this.$bvModale.hide("delete_document_popup");
      this.documentToDelete = null;
    },
    async deleteDocument(isLost) {
      let body = {
        documentId: this.documentToDelete,
        state: this.stateDocToSelected,
        type: this.getCurrentUser.type,
      };
      await this.$api.documents
        .deleteDocument(body)
        .then((data) => {
          this.$bvModal.hide("confirmDeleteDocument");
          //refresh list of document ( perte or suivi ) after delete document
          if (this.stateDocToSelected == "PERTE") {
            let indexDoc = this.documents.findIndex(
              (item) => item.numero == this.documentToDelete
            );
            this.documents.splice(indexDoc, 1);
          } else {
            let indexDoc = this.suiviDocuments.findIndex(
              (item) => item.number == this.documentToDelete
            );
            this.suiviDocuments.splice(indexDoc, 1);
          }
          this.documentToDelete = null;
          this.makeToast("Succès", data.message, "success");
        })
        .catch(async (error) => {
          this.documentToDelete = null;
          this.$bvModal.hide("confirmDeleteDocument");
          this.makeToast(
            "Anomalie",
            "Anomalie technique survenue lors de la suppression de document",
            "danger"
          );
        });
    },
    changeStateDocument(data) {
      let body = {
        number: data.number,
        locked: data.isFollowed,
        userType: this.getCurrentUser.type,
      };
      updateStateDocument(body)
        .then((res) => {
          let indexDoc = this.suiviDocuments.findIndex(
            (item) => item.number == data.number
          );
          this.suiviDocuments[indexDoc].isFollowed =
            !this.suiviDocuments[indexDoc].isFollowed;
          this.makeToast("Succès", res.message, "success");
          // send notification
          if (!data.isFollowed) {
            this.notifContent = `Vous avez verrouillé l’accès à votre ${this.formatDocumentType(
              data.type
            )} portant le numéro  #${data.number}#.`;
            this.sendNotification(
              this.getCurrentUser.type,
              constants.VERROUILLER_UN_DOCUMENT,
              this.getCurrentUser.id,
              this.notifContent
            );
          } else {
            this.notifContent = `Vous avez déverrouillé l'accès à votre ${this.formatDocumentType(
              data.type
            )} portant le numéro #${
              data.number
            }#. Le mode ID Tracker est activé.`;
            this.sendNotification(
              this.getCurrentUser.type,
              constants.DEVERROUILLER_UN_DOCUMENT,
              this.getCurrentUser.id,
              this.notifContent
            );
          }
        })
        .catch(async (error) => {
          this.makeToast(
            "Anomalie",
            "Anomalie technique survenue lors de modification de document",
            "danger"
          );
        });
    },
    selectDocumentToDelete(document) {
      this.dialogDelete = true;
      this.documentToDelete = document;
      this.$bvModal.show("delete_document_popup");
    },
    async fetchDocuments() {
      const response = await this.$api.folders.getFolders(
        this.getCurrentUser.type
      );
      const folders = response;

      const documents = await folders.reduce((current, folder) => {
        return current.concat(
          folder.documents.map((document) => ({
            ...document,
            folder,
            date: this.$moment(document.createdAt).format(
              "DD/MM/YYYY hh:mm:ss"
            ),
          }))
        );
      }, []);
      this.documents = this.documents.concat(documents);
    },
    async fetchLostDocuments() {
      const response = await this.$api.documents.getLostDocuments(
        this.getCurrentUser.type
      );

      const json = response;
      const format = json.results.map((item) => ({
        ...item,
        requestType: "Perte ou vol",
        date: this.$moment(item.createdAt).format("DD/MM/YYYY hh:mm:ss"),
        isMasked: true,
      }));
      this.documents = this.documents.concat(format);
      return format;
    },
    async fetchDemands() {
      const response = await this.$api.documents.getRenewDocuments(
        this.getCurrentUser.type
      );

      const json = response;
      return json.results.map((item) => ({
        ...item,
        requestType: "Renouvellement",
      }));
    },
    async getUserPayments() {
      const response = await getUserCurrentPayments(this.getCurrentUser.type);
      const json = await response.json();
      if (response.status !== 200) {
        return;
      }
      this.currentPayments = json.payments.map((payment) => ({
        ...payment,
        createdAt: this.$moment(payment.createdAt).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
      }));
    },
  },
};
</script>
