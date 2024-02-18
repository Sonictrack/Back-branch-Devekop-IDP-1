<template>
    <div>
    <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="admins-pagination"
        align="center"
        pills
        size="sm"
        class="mt-3"
      ></b-pagination>
    <hr />
    <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
      <b-table
        id="admins-pagination"
        striped
        hover
        :items="admins"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        v-if="!isBusy"
      >

        <template v-slot:cell(suspended)="data">
            <b-form-radio-group
              v-model="data.item.suspended"
              :options="options"
              class="mb-3"
              value-field="item"
              text-field="name"
              buttons
              button-variant="outline-primary"
              size="sm"
              :disabled="data.item.role === 'SUPER'"
            ></b-form-radio-group>
        </template>

        <template v-slot:cell(info)="data">
              <b-icon icon="info-circle-fill" variant="secondary" :id="popoverId(data.item)"></b-icon>
              <b-popover :target="popoverId(data.item)" triggers="hover focus" placement="right">
                <u>Informations supplémentaires:</u>
                <ul>
                <li>{{data.item.firstname}} {{data.item.lastname}}</li>
                <li>{{data.item.email}}</li> 
                <li>Dernière connexion: {{data.item.lastConnected | dateFormat}}</li>
                </ul>
              </b-popover>
        </template>

        <template v-slot:cell(validation)="data">
          <b-button variant="outline-primary" v-if="!isSuperAdmin(data.item)"><b-icon icon="hand-index" variant="dark" @click="saveAction(data.item)"></b-icon></b-button>
        </template>

      </b-table>   
    </div>
</template>

<script>
import { allUsers, updateUser } from "../../api/user";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { UserType } from "~/components/enums/userType";
import { ADMIN_ROLE } from "~/components/enums/role";
// import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";
export default {
    name: "Admins",
    mixins: [mixinMessages], 
    // components: { SpinnerDataDownload },
    data() {
    return {
      isBusy: true,
      spinnerMessage: "Chargement des données...",
      spinnerColor: "primary",
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "role",
          label: "Role",
          sortable: true,
        },
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
          key: "suspended",
          label: "Compte suspendu?"
        },
        {
          key: "numberAttempt",
          label: "Tentatives restantes",
          sortable: true,
        },
        {
          key: "info",
          label: "Autres infos"
        },
        {
          key: "validation",
          label: "Valider"
        }
      ],
      options: [
        { item: true, name: "Oui"},
        { item: false, name: "Non" }
      ],
      admins: [],
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
      this.items = this.admins.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.admins.length;
    },
  },
  methods: {
    isSuperAdmin(admin){
        return admin.role === ADMIN_ROLE.SUPER
    },
    popoverId(admin){
      return admin.id + admin.lastname
    },
    onChangeSuspended(admin){
        if(admin.numberAttempt === 0 && !admin.suspended){
            admin.numberAttempt = 3
        }
    },
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await allUsers(this.$store.state.authentication.type, UserType.admin);
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.admins = json.results;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      } finally {
        this.isBusy = false
      }
    },
    async saveAction(admin) {
      try {
        this.onChangeSuspended(admin)
        const response = await updateUser(this.$store.state.authentication.type, admin, UserType.admin);
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }

        this.makeToast('Succès', json.success, TOAST_MESSAGE_VARIANT.SUCCESS);
        this.onLoadPage();
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
        return;
      }
    },
  },
}

</script>