<template>
<div>
    <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
    <div v-if="user">
    <div v-if="!isBusy">  
      <div class="" v-if="!isEdit">
        <b-container class="d-flex justify-content-center">
            <b-card
              footer-tag="footer"
              border-variant="secondary"
              style="max-width: 40rem;"
              title="Mon compte"
            >
              <hr>
                <b-list-group>
                  <b-list-group-item>
                    <b-avatar variant="info" icon="calendar2-date" class="align-center"></b-avatar>
                    crée le {{ user.createdAt | dateFormat }}
                  </b-list-group-item>
                  <b-list-group-item v-if="!isAdmin">
                    <b-avatar variant="info" icon="upc-scan" class="align-center"></b-avatar>
                    N° client: {{ user.clientNumber }}
                  </b-list-group-item>
                  <b-list-group-item>
                    <b-avatar variant="info" icon="person-fill" class="align-center"></b-avatar>
                    {{ user.firstname }} {{ user.lastname }}
                  </b-list-group-item>
                  <b-list-group-item>
                    <b-avatar variant="info" icon="at" class="align-center"></b-avatar>
                    {{ user.email }}
                  </b-list-group-item>
                  <b-list-group-item v-if="isPartner">
                    <b-avatar variant="info" icon="building" class="align-center"></b-avatar>
                    {{ user.companyName }}
                  </b-list-group-item>
                  <b-list-group-item v-if="isPartner">
                    <b-avatar variant="info" icon="telephone" class="align-center"></b-avatar>
                    {{ user.phoneNumber }}
                  </b-list-group-item>
                  <b-list-group-item v-if="!isAdmin">
                    <div class="d-flex w-100 justify-content-start">
                    <b-avatar variant="info" icon="battery-half" class="align-center mr-1"></b-avatar>
                    <b-progress id="espace-document" :value="user.sizeSpaceUsed" :max="user.sizeSpace" height="2.5rem" class="mouse-help w-75" striped :variant="checkSPaceQuotas"></b-progress>
                    <b-popover target="espace-document" triggers="hover focus" placement="right" variant="primary">
                      Espace occupé ({{ user.sizeSpaceUsed }} / {{ user.sizeSpace }} MB)
                    </b-popover>
                    </div>
                  </b-list-group-item>
                </b-list-group>

              <template v-slot:footer v-if="!isAdmin">
                <div class="text-center">
                  <b-avatar button  id="edit-user" icon="pencil" class="align-center mr-3" variant="success" font-scale="2" @click="edit"></b-avatar>
                  <b-avatar button  id="delete-user" icon="trash" class="align-center mr-3" variant="danger" font-scale="2" @click="toggleModal"></b-avatar>
                </div>
              </template>
            </b-card>
        </b-container>

        <b-modal
            header-bg-variant="warning"
            body-bg-variant="light"
            ref="delete-account-modal"
            hide-footer
            title="Voulez vous supprimer votre compte?"
          >
                  <div class="first-warning-line warning-line text-danger">
            Attention.
          </div>
          <div class="warning-line">
            Supprimer votre compte est une action
            <span class="irreversible">irréversible</span>.
          </div>
          <div class="warning-line">
            Cette action supprimera votre carte d'identité de la base de donnée.
            Êtes-vous sûr de vouloir supprimer votre compte ?
          </div>
          <div class="warning-line">
            Si oui, rentrez la phrase suivante, en respectant les majuscules :
            <span class="sentence">{{ sentence }}</span>
          </div>

          <input
            type="text"
            id="user-input"
            class="mb-3"
            v-model="currentSentence"
            placeholder="Rentrez la phrase précédente"
            aria-label="Écrivez la phrase 'Je souhaite supprimer mon compte', avec une majuscule à la première lettre, et sans point."
          />

                <div class="text-center">
                  <b-avatar button  icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="onRealButtonClick" :disabled="!valid"></b-avatar>
                  <b-avatar button  icon="x" class="align-center mr-3" variant="danger" font-scale="2" @click="toggleModal"></b-avatar>
                </div>
          </b-modal>

      </div>
      <div v-else>
        <app-edit-compte
          :data="user"
          @update="refreshUserDetail"
        ></app-edit-compte>
      </div>
  </div>
  </div>
</div>
</template>

<script>
import Vue from "vue";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";

import { deleteAccount, getAccount } from "~/api/account";

import { UserType } from "../enums/userType";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

import EditCompte from "~/components/commons/EditCompte";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";

const Compte = Vue.extend({
  name: "Account",
  middleware: "authenticated",
  mixins: [mixinUser, mixinMessages],
  components: {
    appEditCompte: EditCompte, SpinnerDataDownload
  },
  data() {
    return {
      isBusy: true,
      spinnerMessage: "Chargement des données...",
      spinnerColor: "primary",
      isEdit: false,
      sentence: "Je souhaite supprimer mon compte",
      currentSentence: "",
      wantsToDeleteAccount: false,
      user: null,
    };
  },
  mounted() {
    this.checkUser().then((result) => {
        if(result)
          this.getUser()
        else
          this.logout()
      })
  },
  computed: {
    checkSPaceQuotas(){
      const value = (this.user.sizeSpaceUsed / this.user.sizeSpace) * 100    
      if( value < 75){
        return "primary"
      } else if(value >= 75 && value < 100) {
        return "warning"
      }
      return "danger"
    },
    isPartner() {
      return this.$store.state.authentication.type === UserType.partner;
    },
    isParticulier() {
      return this.$store.state.authentication.type === UserType.individual;
    },
    isAdmin() {
      return this.$store.state.authentication.type === UserType.admin;
    },
    valid() {
      return this.$data.currentSentence === this.$data.sentence;
    },
  },
  methods: {
    async getUser(){
      try {
        this.isBusy = true;
        const response = await getAccount(this.$store.state.authentication.type);
        if(response.status === 401)
          this.logout()

        const json = await response.json();
        
        if (json.error) {
          throw new Error(json.error)
        }

        this.user = json;
      } catch(e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      } finally {
        this.isBusy = false;
      }
    },
    onFirstButtonClick() {
      this.wantsToDeleteAccount = !this.wantsToDeleteAccount;
      this.currentSentence = "";
    },
    edit() {
      this.isEdit = !this.isEdit;
      },
    refreshUserDetail(update) {
      this.isEdit = false;
      if(update){
        this.getUser()
      }

    },
    async onRealButtonClick() {
      try{
      const response = await deleteAccount(this.$store.state.authentication.type);
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error)
      }

      this.makeToast('Succès', "Votre compte a bien été supprimé.", TOAST_MESSAGE_VARIANT.SUCCESS);

      await this.$store.dispatch("authentication/logoutNoAPI");
      this.$router.push("/");
      } catch(e){
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    showModal() {
      this.$refs["delete-account-modal"].show();
    },
    hideModal() {
      this.$refs["delete-account-modal"].hide();
    },
    toggleModal() {
      this.$refs["delete-account-modal"].toggle("#delete-user");
    }
  },
});

export default Compte;
</script>

<style scoped>
  .content {
    margin: 0 auto;
    max-width: max-content;
  }
  .title {
    text-align: center;
  }
  .shadow {
    margin-top: 20px;
    padding: 20px 50px 50px 50px;
    box-shadow: 10px 10px 5px 0 rgba(0, 0, 0, 0.18);
  }
  .warnings {
    margin: 20px 0;
    padding: 10px;
  }
  .first-warning-line {
    font-weight: bold;
  }
  .sentence {
    font-weight: bold;
  }
  #user-input {
    display: block;
    width: 100%;
  }
  #submit-button {
    margin: 10px 0;
    transition: all 0.2s;
  }

  .mouse-help {
  cursor: help;
}
</style>