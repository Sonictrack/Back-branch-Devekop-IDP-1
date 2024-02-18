<template>
  <div>
      <b-container v-if="folder" class="w-25 mt-3">
        <DetailFolder :folder="folder" />
      </b-container>

      <div>
        <InfosStatusRenouvellevement/>
      </div>

    <div>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="renew-pagination"
        align="center"
        pills
        size="sm"
        class="mt-3"
      ></b-pagination>

      <hr />
      <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
      <b-table
        id="folders-pagination"
        striped
        hover
        :items="demands"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        v-if="!isBusy"
      >
        <template v-slot:cell(status)="data">
          <b-badge :variant="rowClass(data.item)">{{ data.value }}</b-badge>
        </template>

        <template v-slot:cell(ownerId)="data">
            <b-icon icon="folder" scale="1.5" variant="secondary" @click="openFolder(data.value)" class="folder-cursor"></b-icon>
        </template>
        
        <template v-slot:cell(owner)="data">
          <div v-if="isAdmin">
            {{ data.value }}
          </div>
        </template>

        <template v-slot:cell(info)="data">
          <div v-if="isAdmin">
            <b-form-radio-group 
              v-model="data.item.status" :options="options" class="mb-3" value-field="item" text-field="name" buttons button-variant="outline-primary" size="sm">
            </b-form-radio-group>
            <b-form-textarea id="textarea" v-model="data.item.info" rows="3" max-rows="6" v-if="isInfoOrCancelled(data.item)"></b-form-textarea>            
          </div>
          <div v-if="!isAdmin">
            <b-icon icon="info-circle-fill" variant="secondary" :id="popoverId(data.item)"  class="mouse-help" v-if="data.value"></b-icon>
            <b-popover :target="popoverId(data.item)" triggers="hover focus" placement="right">
              {{ data.value }}
            </b-popover>
          </div>
        </template>

        <template v-slot:cell(validation)="data">
            <b-button variant="outline-dark">
              <b-icon icon="hand-index" variant="secondary" @click="saveAction(data.item)"></b-icon>
            </b-button>
        </template>
        
      </b-table>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import { allRenewRequest, changeStatusRenew } from "~/api/renouvellement";
import { getSystemFolder } from "~/api/folder";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";

import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import STATUS_RENEW from "~/components/enums/statusRenew";
import { UserType } from "~/components/enums/userType";
import { SYSTEM_FOLDER } from "~/components/enums/systemFolder";

import DetailFolder from "~/components/commons/folders/DetailFolder";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";
import InfosStatusRenouvellevement from "~/components/commons/demands/InfosStatusRenouvellevement";

const DemandRenouvellement = Vue.extend({
  name: "DemandRenouvellement",
  mixins: [mixinUser, mixinMessages],
  components: { DetailFolder, SpinnerDataDownload, InfosStatusRenouvellevement },
  data() {
    return {
      isBusy: true,
      spinnerMessage: "Chargement des données...",
      spinnerColor: "primary",
      fields: [
        {
          key: "createdAt",
          label: "Créée le",
          formatter: (value) => this.$options.filters.dateFormat(value),
          sortable: true,
        },
        {
          key: "updatedAt",
          label: "Modifiéée le",
          formatter: (value) => this.$options.filters.dateFormat(value),
          sortable: true,
        },
        {
          key: "type",
          label: "Type",
          sortable: true,
        },
        {
          key: "status",
          label: "Statut",
          formatter: (value) => this.mapStatusToText(value),
        },
        {
          key: "info",
          label: "Action/Info"
        }
      ],
      fieldsAdmin:[
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "owner",
          label: "Client",
          sortable: true,
          formatter: (value) => value.clientNumber,
        },
        {
          key: "ownerId",
          label: "Documents"
        },
        {
          key: "validation",
          label: "Valider"
        },
      ],
      options: [
        { item: "EC", name: "En cours" },
        { item: "ANN", name: "Annuler" },
        { item: "VAL", name: "Valider" },
        { item: "INFO", name: "Informer" },
      ],
      demands: [],
      perPage: 5,
      currentPage: 1,
      items: [],
      folder: null,
    };
  },
  mounted() {
    this.checkUser().then((result) => {
        if(result){
          if(this.isAdmin){
            this.fields = [...this.fields, ...this.fieldsAdmin]
          }
          this.onLoadPage();
        }
        else
          this.logout()
      })
  },
  computed: {
    isAdmin() {
      return this.$store.state.authentication.type === UserType.admin;
    },
    rows() {
      this.items = this.demands.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.demands.length;
    },
  },
  methods: {
    async openFolder(ownerId) {
      try {
        const response = await getSystemFolder(
          this.$store.state.authentication.type,
          SYSTEM_FOLDER.RENOUVELLEMENT,
          ownerId
        );
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        this.folder = json.folder;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
        return;
      }
    },
    popoverId(demand) {
      return demand.id + demand.status;
    },
    isInfoOrCancelled(demand) {
      return demand.status === "INFO" || demand.status === "ANN";
    },
    mapStatusToText(value) {
      let text = "";
      switch (value) {
        case "EC": {
          text = "En cours";
          break;
        }
        case "ANN": {
          text = "Annulée";
          break;
        }
        case "VAL": {
          text = "Validée";
          break;
        }
        case "INFO": {
          text = "En attente d'informations";
          break;
        }
        default: {
        }
      }
      return text;
    },
    rowClass(demand) {
      if (demand.status === "EC") return "secondary";
      if (demand.status === "ANN") return "danger";
      if (demand.status === "VAL") return "success";
      if (demand.status === "INFO") return "warning";
    },
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await allRenewRequest(
          this.$store.state.authentication.type
        );
        
        if(response.status === 401)
          this.logout()

        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.demands = json.results;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      } finally {
        this.isBusy = false
      }
    },
    async saveAction(demand) {
      try {
        if (demand.status !== "INFO" && demand.status !== "ANN") {
          demand.info = null;
        }
        const response = await changeStatusRenew(this.$store.state.authentication.type, demand);
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.makeToast('Succès', json.success, TOAST_MESSAGE_VARIANT.SUCCESS);
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
        return;
      }
    },
  },
});

export default DemandRenouvellement;
</script>

<style scoped>
.folder-cursor {
  cursor: pointer;
}

.mouse-help {
  cursor: help;
}
</style>