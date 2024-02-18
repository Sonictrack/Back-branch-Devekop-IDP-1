<template>
  <div>
    <div class="text-center mb-3">
      <b-button
        v-if="isMainPage"
        :class="isCreatePage ? null : 'collapsed'"
        :aria-expanded="isCreatePage ? 'true' : 'false'"
        aria-controls="collapse-create"
        @click="createPage"
      >
        <b-icon icon="plus-square"></b-icon>
        <em>Créer un dossier</em>
      </b-button>
    </div>

    <b-collapse
      id="collapse-create"
      v-model="isCreatePage"
    >
      <FolderFormCreate @update="onLoadPage" @close="closeCreatePage" />
    </b-collapse>

    <div v-if="isEditPage" class="text-center mb-3">
      <FolderFormEdit
        :originalFolder="folderEdit"
        @update="onLoadPage"
        @close="closeEditFolder"
      />
    </div>

    <div v-if="isMainPage">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="folders-pagination"
        align="center"
        pills
        size="sm"
      ></b-pagination>

      <b-card
        no-body
        id="folders-pagination"
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
        border-variant="secondary"
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
            :title="folder.name"
            v-for="folder in items"
            :key="folder.id"
            lazy
          >
            <DetailFolder
              :folder="folder"
              @update="onLoadPage"
              @edit="openEditFolder"
            />
          </b-tab>
        </b-tabs>

        <div class="bg-secondary text-light text-center" v-else>
          Vous ne disposez d'aucuns dossiers
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getFolders } from "~/api/folder";
import mixinUser from "~/mixins/mixinUser";
import DetailFolder from "~/components/commons/folders/DetailFolder";
import FolderFormCreate from "~/components/commons/folders/FolderFormCreate";
import FolderFormEdit from "~/components/commons/folders/FolderFormEdit";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

const Folders = Vue.extend({
  name: "Folders",
  mixins: [mixinUser, mixinMessages],
  components: {
    DetailFolder,
    FolderFormCreate,
    FolderFormEdit,
  },
  data() {
    return {
      isMainPage: true,
      isCreatePage: false,
      isEditPage: false,
      folders: [],
      folderEdit: null,
      perPage: 5,
      currentPage: 1,
      items: [],
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
      this.items = this.folders.slice(
        this.perPage * this.currentPage - this.perPage,
        this.perPage * this.currentPage
      );
      return this.folders.length;
    },
  },
  methods: {
    mainPage() {
      this.isMainPage = true;
      this.isEditPage = false;
      this.isCreatePage = false;
    },
    createPage() {
      this.isMainPage = false;
      this.isEditPage = false;
      this.isCreatePage = true;
    },
    editPage() {
      this.isMainPage = false;
      this.isCreatePage = false;
      this.isEditPage = !this.isEditPage;
    },
    async onLoadPage() {
      try {
        this.folderEdit = null;
        const response = await getFolders(
          this.$store.state.authentication.type
        );

        if(response.status === 401)
          this.logout()
          
        const json = await response.json();

        if (json.error) {
          throw new Error(json.error);
        }

        this.folders = json;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      } finally {
        this.isMainPage = true;
      }
    },
    openEditFolder(folder) {
      this.editPage();
      this.folderEdit = folder;
    },
    closeEditFolder() {
      this.folderEdit = null;
      this.mainPage();
    },
    closeCreatePage() {
      this.isMainPage = !this.isMainPage;
      this.isEditPage = false;
      this.isCreatePage = !this.isCreatePage;
    },
  },
});

export default Folders;
</script>

<style>
.center-card {
  margin: auto;
  width: 35rem;
  border: 0px;
  padding: 0px;
}

.mouse-cursor {
  cursor: pointer;
}
</style>
