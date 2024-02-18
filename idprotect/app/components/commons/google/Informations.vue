<template>
    <div>
    <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="positions-pagination"
        align="center"
        pills
        size="sm"
        class="mt-3"
      ></b-pagination>

      <hr />      
      <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
      
      <b-table
        id="positions-pagination"
        striped
        hover
        :items="positions"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        v-if="!isBusy"
      >
      </b-table>   
    </div>
</template>

<script>
import { getAllPositions } from "~/api/position";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";

export default {
    name: "Informations",
    mixins: [mixinMessages],
    components: { SpinnerDataDownload },
    data() {
    return {
      isBusy: true,
      spinnerMessage: "Chargement des données...",
      spinnerColor: "primary",
      fields: [
        {
          key: "from",
          label: "Client ayant recherché votre document",
          sortable: true,
        },
        {
          key: "action",
          label: "Raison",
        },
        {
          key: "createdAt",
          label: "Recherché le",
          formatter: (value) => this.$options.filters.dateFormat(value),
          sortable: true,
        },
      ],
      fieldsAdmin: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "latitude",
          label: "Latitude",
        },
        {
          key: "longitude",
          label: "Longitude",
        },
        {
          key: "to",
          label: "Client recherché",
          sortable: true,
        },
      ],
      positions: [],
      perPage: 7,
      currentPage: 1,
      items: []
    };
  },
  mounted() {
      if(this.isAdmin){
          this.fields = [...this.fieldsAdmin, ...this.fields]
      }
    this.onLoadPage();
  },
  computed: {
    rows() {
      this.items = this.positions.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.positions.length;
    },
    isAdmin() {
      return this.$store.state.authentication.type === "admin";
    },
  },
  methods: {
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await getAllPositions(this.$store.state.authentication.type);
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.positions = json.positions;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);        
      } finally {
        this.isBusy = false
      }
    }
  },
}

</script>