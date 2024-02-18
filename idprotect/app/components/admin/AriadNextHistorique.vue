<template>
    <div>
    <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="ariadnext-pagination"
        align="center"
        pills
        size="sm"
        class="mt-3"
      ></b-pagination>

      <hr />      
      <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
      
      <b-table
        id="ariadnext-pagination"
        striped
        hover
        :items="historiques"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        v-if="!isBusy"
      >

        <template v-slot:cell(info)="data">
              <b-icon icon="info-circle-fill" variant="secondary" :id="popoverId(data.item)"></b-icon>
              <b-popover :target="popoverId(data.item)" triggers="hover focus" placement="right">
                <div v-for="(message, index) in controls(data.item)" :key="index">
                  <u>{{ message.titleMsg }}</u>
                  <ul>
                    <li v-for="(control, index) in message.controls" :key="index">
                      {{ control.resultMsg }}
                    </li>
                  </ul>
                </div>
              </b-popover>
        </template>

      </b-table>

    </div>
</template>

<script>
import {getHistoriques} from "~/api/ariadnext";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";

export default {
    name: "AriadNextHistorique",
    mixins: [mixinMessages],
    components: { SpinnerDataDownload },
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
          key: "uid",
          label: "uid"
        },
        {
          key: "idType",
          label: "Type",
          sortable: true,
        },
        {
          key: "documentNumber",
          label: "Numéro",
          sortable: true,
        },
        {
          key: "validity",
          label: "Validité"
        },
        {
          key: "info",
          label: "Autres infos"
        }
      ],
    options: [
        { item: true, name: "Oui" },
        { item: false, name: "Non" }
      ],
      historiques: [],
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
      this.items = this.historiques.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.historiques.length;
    },
  },
  methods: {
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await getHistoriques(this.$store.state.authentication.type);
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.historiques = json.historiques;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);      
      } finally {
        this.isBusy = false
      }
    },
    popoverId(historique){
      return  historique.id + historique.uid
    },
    controls(historique){
      if(historique.valdity !== "OK"){
        return JSON.parse(historique.controls)
      }
      return null
    }
  },
}

</script>