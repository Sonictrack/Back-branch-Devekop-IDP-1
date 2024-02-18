<template>
  <div>
      <b-card
        bg-variant="light"
        border-variant="secondary"
        footer-tag="footer"
        class="text-left"
      >

        <b-form-group label-for="folder-name">
          <h5>Nom du dossier</h5>
          <b-form-input
            id="folder-name"
            size="sm"
            placeholder="Nom du dossier"
            v-model="folderName"
            :state="folderNameLengthCheck"
            maxlength=25
            aria-describedby="input-live-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">Veuillez saisir au moins 1 caractère (maximum 25 caractères)</b-form-invalid-feedback>
        </b-form-group>
        
        <b-form-group>
          <h5>Visibilité du dossier</h5>
          <b-form-radio-group
            v-model="selected"
            name="visibility"
            label="Visibilité"
            label-for="visibility"
            buttons
            button-variant="outline-primary"
            size="sm"
          >
            <b-form-radio value="0">Masqué</b-form-radio>
            <b-form-radio value="1">Visible</b-form-radio>
          </b-form-radio-group>
        </b-form-group>

        <b-form-group
          label-for="filesToUpload"
          v-model="filesToUpload"
          v-if="filesToUpload.length>0"
        >
          <h5>Fichiers à télécharger</h5>
          <b-container v-model="filesToUpload" v-if="filesToUpload.length>0">
            <b-row>
              <b-col cols="6" md="4" v-for="(file, index) in filesToUpload" :key="index">
                <b-icon
                  icon="trash"
                  class="rounded"
                  font-scale="1"
                  v-b-tooltip.hover.left
                  title="Supprimer"
                  variant="info"
                  @click="deleteFile(filesToUploadTemp, filesToUpload, index)"
                ></b-icon>
                {{ file.name }}
              </b-col>
            </b-row>
          </b-container>
        </b-form-group>

        <b-form-file
          v-model="filesToUploadTemp"
          placeholder="Fichier(s) ..."
          drop-placeholder="Déposer ici ..."
          multiple
          @change="updateDocuments($event, filesToUpload)"
          :file-name-formatter="formatNames"
          browse-text="Charger"
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

        <template v-slot:footer>
            <div class="text-center">
                <b-avatar button id="validate-create" icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="create" :disabled="!folderNameLengthCheck"></b-avatar>
                <b-avatar button id="cancel-create" icon="x" class="align-center mr-3" variant="danger" font-scale="2" @click="closeCreate"></b-avatar>
                <b-popover target="validate-create" triggers="hover" placement="top" variant="primary">Valider</b-popover>
                <b-popover target="cancel-create" triggers="hover" placement="top" variant="primary">Annuler</b-popover>
              </div>
        </template>
      </b-card>
  </div>
</template>

<script>
import { createFolder } from "~/api/folder";
import mixinMessages from "~/mixins/mixinMessages";
import { Action } from '~/components/enums/action'
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

export default {
  name: 'FolderFormCreate',
  mixins: [mixinMessages],
  data: function() {
    return {
      folderName: "",
      selected: "0",
      currentFile: null,
      filesToUpload: [],
      filesToUploadTemp:[]
    };
  },
  computed: {
    folderNameLengthCheck() {
      if(this.folderName){
        this.folderName = this.folderName.toUpperCase()
        return this.folderName.length > 0 ? true : false;
      }
      return false
    }
  },
  methods: {
    async create() {
      try {
        const response = await createFolder(this.$store.state.authentication.type, this.folderName.toUpperCase(), this.selected, this.filesToUpload);
        const json = await response.json();

        if(json.error){
          throw new Error(json.error)
        }

        this.makeToast('Succès', "Création du dossier effectué !", TOAST_MESSAGE_VARIANT.SUCCESS);

        this.closeCreate();
        this.refreshParent();
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    closeCreate() {
      this.folderName = "";
      this.selected = "0";
      this.currentFile = null;
      this.filesToUpload = [];
      this.filesToUploadTemp = [];
      this.$emit("close");
    },
    refreshParent() {
      this.$emit("update", true);
    },
    
  }
};
</script>