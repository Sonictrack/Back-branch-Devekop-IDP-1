<template>
  <div>
    <div>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="folders-pagination"
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

        <template v-slot:cell(documentIdPath)="data">
            <b-icon
              icon="file-text"
              class="border border-info rounded mx-1 mouse-pointer"
              variant="info"
              font-scale="2"
              @click="displayDocument(data.value, hideRealFilename(data.value))"
            ></b-icon>
        </template>
        <template v-slot:cell(pvPath)="data">
            <b-icon
              icon="file-text"
              class="border border-info rounded mx-1 mouse-pointer"
              variant="info"
              font-scale="2"
              @click="displayDocument(data.value, hideRealFilename(data.value))"
            ></b-icon>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import { getLostDocuments } from "~/api/document";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";

import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { DOCUMENT_TYPE } from "~/components/enums/documentType"
import { UserType } from "~/components/enums/userType";

import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";

const DemandPerte = Vue.extend({
  name: "DemandPerte",
  mixins: [mixinUser, mixinMessages],
  components: { SpinnerDataDownload },
  data() {
    return {
      isBusy: true,
      spinnerMessage: "Chargement des données...",
      spinnerColor: "primary",
      fields: [
        {
          key: "createdAt",
          label: "Date",
          formatter: (value) => this.$options.filters.dateFormat(value),
          sortable: true,
        },
        {
          key: "numero",
          label: "Numéro du document",
          sortable: true,
        },
        {
          key: "typeDemande",
          label: "Type",
          formatter: (value) => this.mapDocumentTypeToText(value),
          sortable: true,
        },
        {
          key: "documentIdPath",
          label: "Document d'identité"
        },
        {
          key: "pvPath",
          label: "Procès verbal"
        },
      ],
      fieldsSuppl: [
        {
          key: "clientNumber",
          label: "N° client",
          sortable: true,
        },
      ],
      demands: [],
      docUrl: null,
      perPage: 5,
      currentPage: 1,
      items: [],
    };
  },
  mounted() {
    this.checkUser().then((result) => {
        if(result){
          if(this.$store.state.authentication.type === UserType.admin){
            this.fields = [this.fieldsSuppl, ...this.fields]
          }
          this.onLoadPage();
        }
        else
          this.getUser()
      })
  },
  computed: {
    rows() {
      this.items = this.demands.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.demands.length;
    },
  },
  methods: {
    mapDocumentTypeToText(value) {
      let text = "";
      switch (value) {
        case DOCUMENT_TYPE.CNI: {
          text = "Carte d'identité";
          break;
        }
        case DOCUMENT_TYPE.PERMIS: {
          text = "Permis";
          break;
        }
        case DOCUMENT_TYPE.PASSEPORT: {
          text = "Passeport";
          break;
        }
        default: {
          text = "Type inconnu";
        }
      }
      return text;
    },
    displayDocument(filepath, filename){
      this.getDocument(filepath, filename, this.makeToast)
    },
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await getLostDocuments(this.$store.state.authentication.type);
        if(response.status === 401)
          this.logout()
        const json = await response.json();

        if (json.error) {
          throw new Error(json.error)
        }

        this.demands = json.results;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      } finally {
        this.isBusy = false;
      }
    },
  },
});

export default DemandPerte;
</script>

<style scoped>
.mouse-pointer {
  cursor: pointer;
}
</style>>