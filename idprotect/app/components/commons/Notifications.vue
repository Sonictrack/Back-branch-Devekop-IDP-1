<template>
<div>
  <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
  <div v-if="!isBusy">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="notifications-pagination"
      align="center"
      pills
      size="sm"
      class="mt-3"
    ></b-pagination>
    <hr />
    <b-table
      id="notifications-pagination"
      striped
      hover
      :items="notifications"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
    ></b-table>
  </div>
</div>
</template>

<script>
import Vue from "vue";
import { getNotifcations } from "~/api/notification";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import mixinUser from "~/mixins/mixinUser";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";

const Notifications = Vue.extend({
  name: "Notifications",
  mixins: [mixinMessages, mixinUser],
  components:{ SpinnerDataDownload },
  data() {
    return {
        isBusy: true,
        spinnerMessage: "Chargement des données...",
        spinnerColor: "primary",
        fields: [
        {
          key: "createdAt",
          label: "Date",
          formatter: value => this.$options.filters.dateFormat(value),
          sortable: true
        },
        {
          key: "action",
          label: "Action",
          sortable: true
        },
        {
          key: "from",
          label: "Utilisateur",
        },
        {
          key: "to",
          label: "Destinataire",
          sortable: true
        },
        {
          key: "detail",
          label: "Détail"
        },
      ],
      notifications: [],
      perPage: 5,
      currentPage: 1,
      items: []
    };
  },
  mounted() {
    this.checkUser().then((result) => {
        if(result)
          this.onLoadPage()
        else
          this.logout()
      })
  },
  computed: {
    rows() {
      this.items = this.notifications.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.notifications.length;
    },
  },
  methods: {
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await getNotifcations(
          this.$store.state.authentication.type
        );

        if(response.status === 401)
          this.logout()

        const json = await response.json();        

        if (json.error) {
          throw new Error(json.error)
        }

        this.notifications = json.notifications;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      } finally {
        this.isBusy = false;
      }
    },
  },
});
export default Notifications;
</script>
