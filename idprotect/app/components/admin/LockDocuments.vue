<template>
    <div>
    <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="documents-pagination"
        align="center"
        pills
        size="sm"
        class="mt-3"
      ></b-pagination>

      <hr />      
      <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
      
      <b-table
        id="documents-pagination"
        striped
        hover
        :items="lockdocuments"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        v-if="!isBusy"
      >

      <template v-slot:cell(action)="data">
        <b-button :id="`edit-document-${data.item.id}`" variant="outline-primary" v-b-toggle.document-sidebar @click="edit(data.item)"><b-icon icon="eye-fill" variant="dark"></b-icon></b-button>
        <b-popover :target="`edit-document-${data.item.id}`" triggers="hover" placement="top" variant="primary">Editer</b-popover>
        <b-button :id="`delete-document-${data.item.id}`" variant="outline-danger" @click="toggleModal(data.item.id)"><b-icon icon="trash-fill" variant="dark"></b-icon></b-button>
        <b-popover :target="`delete-document-${data.item.id}`" triggers="hover" placement="top" variant="danger">Supprimer</b-popover>
        <b-modal
          header-bg-variant="warning"
          body-bg-variant="light"
          :ref="`delete-document-modal-${data.item.id}`"
          hide-footer
          :title="`Voulez vous supprimer le ${data.item.type} N° ${data.item.number} ?`"
        >
              <div class="text-center">
                <b-avatar button  icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="deleteLockDocument(data.item.id)"></b-avatar>
                <b-avatar button  icon="x" class="align-center mr-3" variant="danger" font-scale="2" @click="toggleModal(data.item.id)"></b-avatar>
              </div>
        </b-modal>
      </template>

      </b-table>   

    <b-sidebar id="document-sidebar" title="Edition" no-header shadow backdrop-variant="primary" backdrop no-close-on-backdrop v-if="openSideBar" bg-variant="dark">
      <div class="px-3 py-2">
        <LockDocument :documentProp="documentProp" @close="closeSideBar"/>
      </div>
    </b-sidebar>

    </div>
</template>

<script>
import { getAll, del } from "~/api/lockdocument";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";
import LockDocument from "~/components/admin/LockDocument"

export default {
    name: "LockDocuments",
    mixins: [mixinMessages],
    components: { SpinnerDataDownload, LockDocument },
    data() {
    return {
      isBusy: true,
      spinnerMessage: "Chargement des données...",
      spinnerColor: "primary",
      openSideBar: false,
      documentProp:{
        id: null,
        documentType: null,
        documentNumber: null,
        email: null
      },
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "createdAt",
          label: "Créée le",
          formatter: (value) => this.$options.filters.dateFormat(value),
          sortable: true,
        },
        {
          key: "number",
          label: "N° du document",
          sortable: true,
        },
        {
          key: "type",
          label: "Type",
          sortable: true,
        },
        {
          key: "email",
          label: "email",
          sortable: true,
        },
        {
          key: "action",
          label: "Action"
        },
      ],
    options: [
        { item: true, name: "Oui" },
        { item: false, name: "Non" }
      ],
      lockdocuments: [],
      perPage: 7,
      currentPage: 1,
      items: []
    };
  },
  mounted() {
    this.onLoadPage();
  },
  computed: {
    rows() {
      this.items = this.lockdocuments.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.lockdocuments.length;
    },
  },
  methods: {
    edit(item){
      this.documentProp = item
      this.openSideBar = true
    },
    closeSideBar(value){
      this.openSideBar = false
      this.documentProp = null
      if(value)
        this.onLoadPage()
    },
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await getAll(this.$store.state.authentication.type);
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.lockdocuments = json.documents;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);      
      } finally {
        this.isBusy = false
      }
    },
    async deleteLockDocument(id) {
      try {
        const response = await del(this.$store.state.authentication.type, id);
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.makeToast('Succès', json.success, TOAST_MESSAGE_VARIANT.SUCCESS);
        await this.onLoadPage();
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    showModal() {
      this.$refs["delete-document-modal"].show();
    },
    hideModal() {
      this.$refs["delete-document-modal"].hide();
    },
    toggleModal(id) {
      const toogleValue = `#delete-document-${id}`
      this.$refs[`delete-document-modal-${id}`].toggle(toogleValue);
    }
  },
}

</script>