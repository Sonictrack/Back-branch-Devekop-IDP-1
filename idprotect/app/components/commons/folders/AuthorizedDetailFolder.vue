<template>
  <div>
    <b-card
      bg-variant="light"
      border-variant="info"
      header-tag="header"
      header-bg-variant="secondary"
      footer-tag="footer"
      class="text-left mt-2"
    >
      <template v-slot:header>
          <b-badge
            pill
            variant="warning"
          >Client N° {{ individual.clientNumber }} {{individual.firstname }} {{ individual.lastname }}</b-badge>
          <b-badge pill variant="warning">Dossier : {{ folder.name }}</b-badge>
      </template>

      <b-container fluid="sm" v-if="folder.documents.length>0">
        <b-row>
          <b-col>
            <div
              v-for="document in folder.documents"
              :key="document.id"
            >
              <b-icon
                :id="`document-${document.id}`"
                icon="file-text"
                class="border border-info rounded mx-1"
                variant="info"
                font-scale="2"
                @click="displayDocument(document.path, document.name)"
              ></b-icon>
              <b-popover  :target="`document-${document.id}`" triggers="hover" placement="top" variant="primary" noninteractive>
                {{hideRealFilename(document.name)}}
              </b-popover >
            </div>
          </b-col>
        </b-row>
      </b-container>
      <div v-else>
        <b-icon icon="exclamation-triangle" class="rounded mr-3" font-scale="2" variant="primary"></b-icon>Ce dossier est vide !
      </div>

      <template v-slot:footer>
        <div class="text-center">
          <b-avatar button :id="`delete-auth-${folder.id}`" name="delete-auth" icon="folder-minus" class="align-center" variant="success" font-scale="2" @click="toggleModal(folder.id)"></b-avatar>
          <b-avatar button :id="`back-${folder.id}`" name="back" icon="x" class="align-center" variant="danger" font-scale="2" @click="close"></b-avatar>
          <b-popover :target="`delete-auth-${folder.id}`" triggers="hover" placement="top" variant="primary">Retirer l'autorisation</b-popover>
          <b-popover :target="`back-${folder.id}`" triggers="hover" placement="top" variant="primary">Retour</b-popover>
        </div>
      </template>

    </b-card>
    <b-modal header-bg-variant="warning" body-bg-variant ="light" ref="delete-autorization-modal" hide-footer title="Voulez vous retirer votre autorisation ?">
      <div class="text-center">
        <b-avatar button id="validate" name="validate" icon="check2" class="align-center" variant="success" font-scale="2" @click="deleteAuthorization(folder.id)"></b-avatar>
        <b-avatar button id="close" name="close" icon="x" class="align-center" variant="danger" font-scale="2" @click="toggleModal(folder.id)"></b-avatar>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getDocUrl } from "~/api/document";
import { deleteAuthorization } from "~/api/folder";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { Action } from '~/components/enums/action'
import mixinDocument from '../../../mixins/mixinDocument';

export default {
  name: 'AuthorizedDetailFolder',
  mixins: [mixinUser, mixinMessages, mixinDocument],
  props: ["individual", "folder"],
  methods: {
    async deleteAuthorization(folderId) {
      try {

        const result = await deleteAuthorization(this.$store.state.authentication.type, folderId);
        const json = await result.json();

        if (json.error) {
          throw new Error(json.error)
        }
        this.makeToast('Succès', json.success, TOAST_MESSAGE_VARIANT.SUCCESS);
        this.close();
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    displayDocument(filepath, filename){
      this.getDocument(filepath, filename, this.makeToast)
    },
    close() {
      this.$emit("closeFolderDetail", true);
    },
    showModal() {
      this.$refs["delete-autorization-modal"].show();
    },
    hideModal() {
      this.$refs["delete-autorization-modal"].hide();
    },
    toggleModal(id) {
      const toogleValue = `#delete-folder-${id}`
      this.$refs["delete-autorization-modal"].toggle(toogleValue);
    }
  }
};
</script>