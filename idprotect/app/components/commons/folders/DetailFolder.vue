<template>
    <b-card
      :title="titleFolder()"
      header-tag="header"
      footer-tag="footer"      
    >
      <template v-slot:header>
        <b-row>
          <b-col lg="6" class="pb-1">
            <b-icon
              :id="`unlock-folder-${folder.id}`"
              icon="unlock-fill"
              font-scale="2"
              v-if="folder.visibility"
              variant="dark"
            ></b-icon>
            <b-icon
              v-else
              :id="`lock-folder-${folder.id}`"
              icon="lock-fill"
              font-scale="2"
              variant="dark"
            ></b-icon>
            <!-- <b-popover :target="`unlock-folder-${folder.id}`" triggers="hover" placement="top" variant="primary">Dossier visible</b-popover> -->
            <!-- <b-popover :target="`lock-folder-${folder.id}`" triggers="hover" placement="top" variant="primary">Dossier masqué</b-popover> -->
            <b>{{folder.name}}</b>
          </b-col>
          <b-col lg="6" class="pb-1 d-flex flex-row-reverse" size="xs">
                <b-avatar button :id="`delete-folder-${folder.id}`" icon="trash" class="align-center mr-3" variant="danger" font-scale="2" @click="toggleModal(folder.id)" v-if="!folder.system"></b-avatar>
                <b-avatar button :id ="`update-folder-${folder.id}`" icon="pencil" class="align-center mr-3" variant="success" font-scale="2" @click="editer(folder)"  v-if="!isAdmin"></b-avatar>
                <b-popover :target="`delete-folder-${folder.id}`" triggers="hover" placement="top" variant="primary">Supprimer le dossier</b-popover>
                <b-popover :target="`update-folder-${folder.id}`" triggers="hover" placement="top" variant="primary">Editer le dossier</b-popover>
          </b-col>
        </b-row>
      </template>

      <b-container>
        <b-row>
          <b-col>
            <div class="mouse-cursor" v-for="document in folder.documents" :key="document.id">
            <b-icon              
              :id="`document-${document.name}`"
              icon="file-text"
              class="border border-info rounded mx-1"
              variant="info"
              font-scale="2"
              @click="displayDocument(document.path, document.name)"
              >
            </b-icon>
              <b-popover :target="`document-${document.name}`" triggers="hover" placement="top" variant="primary">{{hideRealFilename(document.name)}}</b-popover>
              </div>  
          </b-col>
        </b-row>
      </b-container>

      <template v-slot:footer>
        <div class="text-left">
          <p>Autorisations</p>
          <em v-if="folder.adminAccess">
              <b-badge
                id="admin-auth"
                variant="success"
                class="mr-2 mouse-arrow"
              >ID Protect</b-badge>
              <b-popover target="admin-auth" triggers="hover" placement="top" variant="success">Autorisé à visualiser ce dossier</b-popover>
          </em> 
          <em v-if="hasClientsAuthorisation">
            <span v-for="authorization in folder.authorizations" :key="authorization.id">
              <b-badge
                :id="`auth-${authorization.id}`"
                variant="success"
                v-if="authorization.isAuthorized"
                class="mr-2 mouse-arrow"
              >{{getDetailUser(authorization.client)}}</b-badge>
              <b-popover :target="`auth-${authorization.id}`" triggers="hover" placement="top" variant="success">Autorisé à visualiser ce dossier</b-popover>
              <b-badge
                :id="`ask-auth-${authorization.id}`"
                variant="warning"
                v-if="!authorization.isAuthorized"
                class="mr-2 mouse-arrow blink_authorization_pending"
              >{{getDetailUser(authorization.client)}}</b-badge>
              <b-popover :target="`ask-auth-${authorization.id}`" triggers="hover" placement="top" variant="warning">Demande l'autorisation à visualiser le dossier</b-popover>
            </span>
          </em>
        </div>

        <b-modal
          header-bg-variant="warning"
          body-bg-variant="light"
          ref="delete-detail-modal"
          hide-footer
          :title="`Voulez vous supprimer le dossier ${folder.name}?`"
        >
              <div class="text-center">
                <b-avatar button  icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="deleteFolder(folder.id)"></b-avatar>
                <b-avatar button  icon="x" class="align-center mr-3" variant="danger" font-scale="2" @click="toggleModal(folder.id)"></b-avatar>
              </div>
        </b-modal>
      </template>
    </b-card>
</template>

<script>
import { deleteFolder } from "~/api/folder";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";


import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { Action } from '~/components/enums/action'
import { UserType } from "~/components/enums/userType";
import mixinDocument from '../../../mixins/mixinDocument';

export default {
  name: 'DetailFolder',
  mixins: [mixinUser, mixinMessages, mixinDocument],
  props: ["folder"],
  computed:{
    hasClientsAuthorisation(){
      return this.folder.authorizations && this.folder.authorizations.length>0
    }
  },
  methods: {
    displayDocument(filepath, filename){
      this.getDocument(filepath, filename, this.makeToast)
    },
    titleFolder(){
      return !this.folder.documents?'0 document(s)':`${this.folder.documents.length} document(s)`
    },
    async deleteFolder(folderId) {
      try {
        const result = await deleteFolder(this.$store.state.authentication.type, folderId);
        const json = await result.json();
        if (json.error) {
          throw new Error(json.error)
        }

        this.makeToast('Succès', json.success, TOAST_MESSAGE_VARIANT.SUCCESS);
        this.sendNotification(Action.SUPPRESSION_DOSSIER , Action.PORTAIL, `Dossier ${this.folder.name}`);
        this.hideModal();
        this.refresh();
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    editer(folder) {
      this.$emit("edit", folder);
    },
    refresh(event) {
      this.$emit("update", true);
    },
    showModal() {
      this.$refs["delete-detail-modal"].show();
    },
    hideModal() {
      this.$refs["delete-detail-modal"].hide();
    },
    toggleModal(id) {
      const toogleValue = `#delete-folder-${id}`
      this.$refs["delete-detail-modal"].toggle(toogleValue);
    }
  }
};
</script>

<style scoped>
.folder-preview {
  border: 1px solid #ccc;
  box-shadow: 0 2px 2px #ccc;
  background-color: white;
  width: 90%;
}

@media (min-width: 850px) {
  .folder-preview {
    width: 400px;
    margin: 10px;
  }
}

.mouse-cursor {
  cursor: pointer;
}

.mouse-arrow {
  cursor: default;
}

.blink_authorization_pending {
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>>
