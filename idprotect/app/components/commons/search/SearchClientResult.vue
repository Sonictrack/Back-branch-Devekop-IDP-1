<template>
  <div v-if="client">
    <b-card
      bg-variant="light"
      border-variant="secondary"
      header-tag="header"
      class="text-left"
    >
      <template v-slot:header>
        <h6 class="mb-0">
          Dossiers du client
          <b-badge
            pill
            variant="warning"
          >{{ client.firstname }} {{ client.lastname }} </b-badge>
        </h6>
      </template>

      <b-container v-if="!isFoldersEmpty">
        <b-row>
          <b-col cols="12" v-for="folder in client.folders" :key="folder.id">
            <div v-if="isFolderCanBeAuthorized(folder)">
              <b-icon
                :id="`folder-can-authorize-${folder.id}`"
                name="folder-can-authorize"
                icon="folder-plus"
                :class="folder.blink ? 'rounded mouse-cursor blink_authorization_pending' : 'rounded mouse-cursor'"
                font-scale="2"
                variant="success"
                @click="addRemoveDemandsAuthorizations(folder)"
              ></b-icon>
              {{ folder.name }}
              <b-popover  :target="`folder-can-authorize-${folder.id}`" triggers="hover" placement="left" variant="primary" noninteractive>
                Demander l'autorisation
              </b-popover >
            </div>
            <div v-if="isFolderAlreadyAuthorized(folder)">
              <b-icon
                :id="`folder-already-authorize-${folder.id}`"
                name="folder-already-authorize"
                icon="folder-check"
                class="rounded"
                font-scale="2"
                variant="success"
              ></b-icon>
              {{ folder.name }}
              <b-popover :target="`folder-already-authorize-${folder.id}`" triggers="hover" placement="left" variant="primary">
                Vous êtes déjà autorisé sur ce dossier
              </b-popover>
            </div>
            <div v-if="isFolderPendingAuthorization(folder)">
              <b-icon
                :id="`folder-pending-authorize-${folder.id}`"
                icon="folder-symlink"
                class="rounded"
                font-scale="2"
                variant="secondary"
              ></b-icon>
              {{ folder.name }}
              <b-popover :target="`folder-pending-authorize-${folder.id}`" triggers="hover" placement="left" variant="primary">
                Votre demande est en attente d'authorisation
              </b-popover>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <div v-else>
        <b-icon
          icon="exclamation-triangle"
          class="rounded"
          font-scale="2"
          variant="info"
        ></b-icon>
        Ce client ne dispose d'aucuns dossiers !
      </div>

      <template v-slot:footer>
        <div class="text-center">
          <div
            v-if="demandesAuthorizationsLength"
          >vous avez selectionné {{ demandesAuthorizations.length }} dossier(s)</div>
              <div class="text-center">
                <b-avatar button  id="validate" icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="demanderAcces" :disabled="!demandesAuthorizationsLength"></b-avatar>
                <b-avatar button  id="back" icon="x" class="align-center mr-3" variant="danger" font-scale="2" @click="retourRecherche"></b-avatar>
              <b-popover target="validate" triggers="hover" placement="tope" variant="primary">
                Valider
              </b-popover>
              <b-popover target="back" triggers="hover" placement="top" variant="primary">
                Retour
              </b-popover>
              </div>
        </div>
      </template>
    </b-card>
  </div>
</template>


<script>
import { askFoldersAuthorization } from "~/api/folder";
import { Action } from '~/components/enums/action'
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import mixinUser from "~/mixins/mixinUser";

export default {
  name: "SearchClientResult",
  props: ["resultFound"],
  mixins: [mixinUser, mixinMessages],
  data() {
    return {
      user: this.resultFound.user,
      client: this.resultFound.result,
      demandesAuthorizations: []
    };
  },
  computed: {
    demandesAuthorizationsLength() {
      return this.demandesAuthorizations.length > 0;
    },
    isFoldersEmpty(){
      return this.client.folders === null || this.client.folders.length === 0
    }
  },
  methods: {
    isFolderAlreadyAuthorized(folder) {
      for(let i = 0; i < folder.authorizations.length; i++){
        const a = folder.authorizations[i]
        if(a.clientId === this.user.id && a.isAuthorized)
          return true
      }
      return false
    },
    isFolderPendingAuthorization(folder) {
      for(let i = 0; i < folder.authorizations.length; i++){
        const a = folder.authorizations[i]
        if(a.clientId === this.user.id && !a.isAuthorized)
          return true
      }
      return false
    },
    isFolderCanBeAuthorized(folder) {
      for(let i = 0; i < folder.authorizations.length; i++){

        const a = folder.authorizations[i]
        if(a.clientId === this.user.id)
          return false
      }

      return true
    },
    addRemoveDemandsAuthorizations(folder) {
      if (folder.blink == null || folder.blink === false) {
        folder.blink = true;
        this.demandesAuthorizations.push(folder.id);
      } else {
        folder.blink = false;
        let index = this.demandesAuthorizations.indexOf(folder.id);
        if (index !== -1) {
          this.demandesAuthorizations.splice(index, 1);
        }
      }
    },
    async demanderAcces() {
      try {
        const result = await askFoldersAuthorization(this.$store.state.authentication.type, this.demandesAuthorizations);
        const jsonResult = await result.json();

        if (jsonResult.error) {
          throw new Error(jsonResult.error);
        }

        let textDetail = "Dossiers :"
        this.client.folders.forEach(folder => {
          if(this.demandesAuthorizations.find(value => folder.id === value)){
            textDetail += folder.name
          } 
        });

        this.sendNotification(Action.DEMANDE_AUTORISATION , this.client.clientNumber, textDetail);
        this.makeToast('Succès', jsonResult.success, TOAST_MESSAGE_VARIANT.SUCCESS);
        this.retourRecherche();
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    retourRecherche() {
      this.$emit("result", null);
    }
  }
};
</script>


<style scoped>
.mouse-cursor {
  cursor: pointer;
}

.blink_authorization_pending {
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>