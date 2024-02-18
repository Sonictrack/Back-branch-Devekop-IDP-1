<template>
  <div v-if="!isOpenedFolder">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="clients-pagination"
      align="center"
      pills
      size="sm"
    ></b-pagination>

    <b-card
      no-body
      id="clients-pagination"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      border-variant="primary"
    >
      <b-tabs
        content-class="mt-3"
        align="center"
        card
        :cols="perPage"
        v-if="items.length > 0"
        fill
        active-nav-item-class="font-weight-bold text-uppercase text-dark"
      >
        <b-tab
          :title="`Client n°: ${individual.clientNumber}`"
          v-for="individual in individualsFolders"
          :key="individual.id"
        >
          <b-container fluid="sm">
            <b-row>
              <b-col
                v-for="folder in individual.folders"
                :key="folder.id"
                lg="2"
              >
                <div
                  class="mouse-cursor"
                  v-if="folder.authorizations[0].isAuthorized"
                >
                  <b-icon
                    :id="`folder-auth-${folder.id}`"
                    icon="folder-check"
                    class="rounded"
                    font-scale="2"
                    variant="success"
                    @click="openFolder(individual, folder)"
                  ></b-icon>
                  {{ folder.name }}
                  <b-popover :target="`folder-auth-${folder.id}`" triggers="hover" placement="top" variant="primary">
                    Dossier autorisé
                  </b-popover>
                </div>
                <div v-else>
                  <b-icon
                    :id="`folder-pending-${folder.id}`"
                    icon="folder-symlink"
                    class="rounded"
                    font-scale="2"
                    variant="secondary"
                  ></b-icon>
                  {{ folder.name }}
                  <b-popover :target="`folder-pending-${folder.id}`" triggers="hover" placement="top" variant="primary">
                    Votre demande est en attente d'authorisation
                  </b-popover>
                </div>
              </b-col>
            </b-row>
          </b-container>
        </b-tab>
      </b-tabs>

      <div class="bg-secondary text-light text-center" v-else>
        Vous n'avez accès à aucuns dossiers d'autres particuliers
      </div>
    </b-card>
  </div>
  <div v-else>
    <AuthorizedDetailFolder
      :individual="individual"
      :folder="folder"
      @closeFolderDetail="closeFolderDetail($event)"
    ></AuthorizedDetailFolder>
  </div>
</template>

<script>
import AuthorizedDetailFolder from "~/components/commons/folders/AuthorizedDetailFolder";
import { Action } from "~/components/enums/action";
import mixinUser from '../../../mixins/mixinUser';

export default {
  name: 'AuthorizedFolders',
  props: ["individualsFolders"],
  components: { AuthorizedDetailFolder },
  mixins:[mixinUser],
  data() {
    return {
      isOpenedFolder: false,
      folder: null,
      individual: null,
      perPage: 5,
      currentPage: 1,
      items: [],
    };
  },
  computed: {
    rows() {
      this.items = this.individualsFolders.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.individualsFolders.length;
    },
  },
  methods: {
    openFolder(individual, folder) {
      try {
        this.individual = individual;
        this.folder = folder;
        this.isOpenedFolder = !this.isOpenedFolder;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    closeFolderDetail(closeDetailFolder) {
      if (closeDetailFolder) {
        this.individual = null;
        this.folder = null;
        this.isOpenedFolder = !this.isOpenedFolder;
        this.$emit("refreshData", true);
      }
    },
  },
};
</script>

<style scoped>
.mouse-cursor {
  cursor: pointer;
}
</style>
