<template>
  <div class="mb-3 text-center">
    <div class="text-left">
      <b-card
        bg-variant="light"
        border-variant="primary"
        header-tag="header"
        header-bg-variant="primary"
        footer-tag="footer"
        class="text-left"
      >
        <template v-slot:header>
          <h6 class="mb-0">
            <b-badge pill variant="info">Crée le {{folder.createdAt | dateFormat}}</b-badge>
            <b-badge
              pill
              variant="warning"
              v-if="folder.createdAt !== folder.updatedAt"
            >Modifié le {{folder.updatedAt | dateFormat}}</b-badge>
          </h6>
        </template>

        <b-form-group label-for="folder-name">
          <h5>Nom du dossier</h5>
          <b-form-input
            id="folder-name"
            size="sm"
            placeholder="Nom du dossier"
            v-model="folder.name"
            :state="folderNameLength"
            aria-describedby="input-live-feedback"
            trim
            maxlength=25
            :disabled="isSystemFolder"
          ></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">Veuillez saisir au moins 1 caractère (maximum 25 caractères)</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group>
          <h5>Visibilité du dossier</h5>
          <b-form-radio-group
            v-model="visibility"
            name="visibility"
            label-for="visibility"
            buttons
            button-variant="outline-primary"
          >
            <b-form-radio value="0">Non visible</b-form-radio>
            <b-form-radio value="1" :disabled="isSystemFolder">Visible</b-form-radio>
          </b-form-radio-group>
        </b-form-group>


        <hr>
        <h5>Autorisations</h5>
        <b-container fluid="sm">
          <b-row v-for="authorization in folder.authorizations" :key="authorization.clientId">
            <b-col col lg="2"><b-badge :id="`auth-${authorization.clientId}`" variant="light">{{getDetailUser(authorization.client)}}</b-badge></b-col>
            <b-col>                
              <b-form-radio-group
              v-model="authorization.isAuthorized"
              :options="options"
              :name="`radio-${authorization.clientId}`"
              ></b-form-radio-group>
            </b-col>
          </b-row>
        </b-container>

        <b-form-group
          label-for="documents"
          v-model="folder.documents"
          v-if="folder.documents.length>0"
          class="mr-2 mouse-cursor"
        >
          <hr>
          <h5>Fichiers actuels</h5>
          <b-container v-model="folder.documents" v-if="folder.documents.length>0">
            <b-row>
              <b-col cols="6" md="4" v-for="(document, index) in folder.documents" :key="document.id">
                <b-icon
                  :id="`actual-${document.id}`"
                  icon="trash"
                  class="rounded"
                  font-scale="1"
                  variant="danger"
                  @click="deleteDocumentsFile(index)"
                ></b-icon>
                <b-popover :target="`actual-${document.id}`" triggers="hover" placement="top" variant="primary">Supprimer</b-popover>
                <p @click="displayDocument(document.path, document.name)">{{ hideRealFilename(document.name) }}</p>
              </b-col>
            </b-row>
          </b-container>
        </b-form-group>
        
        <b-form-group label-for="filesToUpload">
          <hr>
          <h5>Fichiers à télécharger</h5>
          <b-container v-model="filesToUpload" v-if="filesToUpload.length>0">
            <b-row>
              <b-col cols="6" md="4" v-for="(file, index) in filesToUpload" :key="index">
                <b-icon
                  :id="`download-${index}`"
                  icon="trash"
                  class="rounded mouse-cursor"
                  font-scale="1"
                  variant="info"
                  @click="deleteFile(filesToUploadTemp, filesToUpload, index)"
                ></b-icon>
                <b-popover :target="`download-${index}`" triggers="hover" placement="top" variant="primary">Supprimer</b-popover>
                {{ file.name }}
              </b-col>
            </b-row>
          </b-container>
        </b-form-group>

        <b-form-file
          ref="tempFiles"
          v-model="filesToUploadTemp"
          placeholder="Fichier(s) ..."
          drop-placeholder="Déposer ici ..."
          multiple
          :file-name-formatter="formatNames"
          @change="updateDocuments($event, filesToUpload)"
          class="mb-3"
          browse-text="Charger"
          size="sm"
        >
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="info">{{ names[0] }}</b-badge>
            <b-badge
              v-if="names.length > 1"
              variant="info"
              class="ml-1"
            >+ {{ names.length - 1 }} fichiers supplémentaires</b-badge>
          </template>
        </b-form-file>

        <b-form-group
          label-for="filesToDelete"
          v-model="filesToDelete"
          v-if="filesToDelete.length>0"
        >
          <hr>
          <h5>Fichiers à supprimer</h5>
          <b-container v-model="filesToDelete" v-if="filesToDelete.length>0">
            <b-row>
              <b-col cols="6" md="4" v-for="(document, index) in filesToDelete" :key="document.id">
                <b-icon
                  :id="`cancel-${document.id}`"
                  icon="trash"
                  class="rounded mouse-cursor"
                  font-scale="1"
                  variant="dark"
                  @click="putBackFileToDocuments(index)"
                ></b-icon>
                <b-popover :target="`cancel-${document.id}`" triggers="hover" placement="top" variant="primary">Annuler la suppression</b-popover>
                <p @click="displayDocument(document.path, document.name)">{{ hideRealFilename(document.name) }}</p>
              </b-col>
            </b-row>
            <hr>
          </b-container>
        </b-form-group>

        <template v-slot:footer>
          <div class="text-center">
            <b-avatar button  icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="updateFolder" :disabled="disableCreateButton()"></b-avatar>
            <b-avatar button  icon="x" class="align-center mr-3" variant="danger" font-scale="2" @click="closeEditFolder"></b-avatar>
          </div>
        </template>

      </b-card>
    </div>
  </div>
</template>

<script>
import { updateFolder } from "~/api/folder";
import mixinUser from "~/mixins/mixinUser";
import mixinDocument from "~/mixins/mixinDocument";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { Action } from '~/components/enums/action'

export default {
  name: 'FolderFormEdit',
  mixins: [mixinUser, mixinMessages, mixinDocument],
  props: ["originalFolder"],
  data() {
    return {
        selected: 'first',
        options: [
          { text: 'En attente', value: false, disabled: false},
          { text: 'Validée', value: true, disabled: false },
          { text: 'Refuser', value: null, disabled: false }
        ],
      folder: JSON.parse(JSON.stringify(this.originalFolder)),
      visibility: this.initVisibility(),
      filesToDelete: [],
      filesToUpload: [],
      filesToUploadTemp:[]
    };
  },
  watch: {
    originalFolder: function() {
      this.folder = this.originalFolder;
      this.visibility = this.initVisibility();
    },
  },
  computed: {
    isSystemFolder(){
      return this.folder.system
    },
    folderNameLength() {
      if(this.folder.name){
        this.folder.name = this.folder.name.toUpperCase()
        return this.folder.name.length > 0 ? true : false;
      }
      return false
    },
    radioButton(authorization){
      if(authorization)
        return 1
      return 0
    },
    variantAuthorization(authorization){
      if(authorization === 1)
        return "success"
      else if(authorization === 0)
        return "warning"
      return "danger" 
    }
  },
  methods: {
    displayDocument(filepath, filename){
      this.getDocument(filepath, filename, this.makeToast)
    },
    initVisibility(){
      return this.originalFolder.visibility === true ? 1 : 0;
    },
    async updateFolder() {
      try {
        this.folder.visibility = this.visibility == 1 ? true : false;
        let response = await updateFolder(
          this.$store.state.authentication.type,
          this.folder,
          this.filesToUpload,
          this.filesToDelete
        );

        let json = await response.json();

        if (json.error) {
          throw new Error(json.error)
        }

        this.makeToast('Succès', "Le dossier a été mis à jour avec succès!", TOAST_MESSAGE_VARIANT.SUCCESS);

        this.refreshParent();
        this.closeEditFolder();
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    deleteDocumentsFile(index) {
      this.filesToDelete.push(this.folder.documents[index]);
      this.folder.documents.splice(index, 1);
    },
    putBackFileToDocuments(index) {
      this.folder.documents.push(this.filesToDelete[index]);
      this.filesToDelete.splice(index, 1);
    },
    disableCreateButton() {
      return this.folder.name.length < 2;
    },
    closeEditFolder() {
      this.$emit("close", null);
    },
    refreshParent() {
      this.$emit("update", true);
    },
  }
};
</script>

<style scoped>
.center {
  margin: auto;
  width: 50%;
  border: 3px solid #73ad21;
  padding: 10px;
}
a,
a:hover,
a:focus,
a:active {
  text-decoration: none;
  color: inherit;
}
</style>