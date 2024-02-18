<template>
  <div>
    <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>
    <div>
      <b-alert variant="info" show>
        <div v-for="(message, index) in messages" :key="index">
        {{ message.titleMsg }}
        <ul>
          <li v-for="(control, index) in message.controls" :key="index">
            {{ control.resultMsg }}
          </li>
        </ul>
        </div>
      </b-alert>
    </div>
    <div v-if="!isAriadNextUp">
      <b-alert variant="danger" show>Le service ne répond pas!</b-alert>
    </div>
    <div v-else>
    <form enctype="multipart/form-data" @submit.prevent="onSubmit">
        <b-card
            class="text-center"
            border-variant="primary"
        >
          <template v-slot:header>
            <div>
              <b-form-radio-group v-if="!isProdUri"
                v-model="selected"
                :options="options"
                class="mb-3"
                value-field="item"
                text-field="name"
                disabled-field="notEnabled"
                ></b-form-radio-group>
            Il vous reste <b-badge v-if="seuil" variant="danger" class="blink_authorization_pending">{{ credit }}</b-badge>
            <b-badge v-else variant="success">{{ credit }}</b-badge> crédit(s) (raffraichissement effectué toutes les 24H)
            </div>
          </template>
          <div class="inputs">
            <div class="dropbox" @click="() => this.$refs.rectoInput.click()">
              <input
                  type="file"
                  :disabled="isUploading"
                  class="file-upload"
                  accept="image/jpeg, image/png, application/pdf"
                  ref="rectoInput"
                  @change="changeRecto"
              />

              <p v-if="!isUploading && !recto">
                Cliquez ici pour sélectionner votre recto.
              </p>
              <div v-else-if="recto">
                <img v-if="rectoPreview" :src="rectoPreview" alt="Votre recto"/>
                <p v-else>Chargement du recto...</p>
              </div>
              <p v-else>Envoi de votre recto...</p>
            </div>

            <div class="dropbox" @click="() => this.$refs.versoInput.click()">
              <input
                  type="file"
                  :disabled="isUploading"
                  class="file-upload"
                  accept="image/jpeg, image/png, application/pdf"
                  ref="versoInput"
                  @change="changeVerso"
              />

              <p v-if="!isUploading && !verso">
                Cliquez ici pour sélectionner le verso.
              </p>
              <div v-else-if="verso">
                <img v-if="versoPreview" :src="versoPreview" alt="Votre verso"/>
                <p v-else>Chargement du verso...</p>
              </div>
              <p v-else>Envoi de votre verso...</p>
            </div>
          </div>
          <template v-slot:footer>
            <b-button type="submit" variant="secondary">Lancer une vérification</b-button>
          </template>

        </b-card>

    </form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import {healthcheck, userInfo, documentAnalysis} from "~/api/ariadnext";
import {TOAST_MESSAGE_VARIANT} from "~/components/enums/messageToast";
const AriadNext = Vue.extend({
  name: "AriadNext",
  mixins: [mixinUser, mixinMessages],
  components: { SpinnerDataDownload },
  data() {
    return {
      isBusy: true,
      spinnerMessage: "Vérification du document...",
      spinnerColor: "primary",
      isProdUri: process.env.VUE_APP_ARIAD_NEXT_URI_PROD,
      selected: 'SANDBOX',
      options: [
          { item: 'SANDBOX', name: 'Sandbox' },
          { item: 'TEST', name: 'Test' }
      ],
      min: 200,
      credit: 0,
      isAriadNextUp: false,
      isUploading: false,
      rectoPreview: null,
      versoPreview: null,
      recto: null,
      verso: null,
      messages: null,
      perte: false,
      coffre: false,
      validity: null,
      info: false
    };
  },
  computed: {
    seuil() {
      return this.credit <= this.min;
    },
  },
  mounted() {
    this.checkUser().then((result) => {
      if (!result)
        this.logout()
      else
        this.userInfo()
    })
  },
  methods: {
    async healthcheck() {
      try {
        this.isAriadNextUp = false;
        const response = await healthcheck(this.$store.state.authentication.type, this.selected);
        if (response.status === 401)
          this.logout()

        const json = await response.json();

        if (json.error) {
          throw new Error(json.error)
        }
        this.isAriadNextUp = true;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    async userInfo() {
      try {
        this.isBusy = false;
        this.isAriadNextUp = false;
        const response = await userInfo(this.$store.state.authentication.type, this.selected);
        if (response.status === 401)
          this.logout()

        const json = await response.json();

        if (json.error) {
          throw new Error(json.error)
        }
        this.isAriadNextUp = true;
        this.credit = json.result.remainingCredits;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    async changeRecto(event) {

      const {files} = event.target;
      this.recto = files[0];

      this.rectoPreview = null;

      if (!this.recto) {
        return;
      }

      const reader = new FileReader()
      reader.onload = async (event) => (this.rectoPreview = event.target.result)
      reader.readAsDataURL(this.recto)
    },

    async changeVerso(event) {
      const {files} = event.target;
      this.verso = files[0];

      this.versoPreview = null;

      if (!this.verso) {
        return;
      }
      const reader = new FileReader()
      reader.onload = async (event) => (this.versoPreview = event.target.result)
      reader.readAsDataURL(this.verso)
    },

    async onSubmit() {
      if (!this.recto)
        return this.makeToast('Anomalie', `Sélectionnez une photo du recto de votre pièce d'identité`, TOAST_MESSAGE_VARIANT.DANGER);

      if (!this.verso && !this.info){
        this.info = true
        return this.makeToast('Attention', "Sélectionnez une photo du verso de votre pièce d'identité si votre pièce en dispose", TOAST_MESSAGE_VARIANT.WARNING);
      }
        

      let result;
      try {
        this.isUploading = true
        this.isBusy = true;
        result = await documentAnalysis(this.$store.state.authentication.type, this.rectoPreview, this.versoPreview, this.selected);

      if (result.status === 401) {
        this.logout()
      }

      if (result.status === 413) {
        return this.makeToast('Anomalie', "Vous avez dépassé la taille maximum de 10Mo pour vos deux fichiers.", TOAST_MESSAGE_VARIANT.DANGER);
      }

      const json = await result.json()

      if (json.error)
        throw new Error(json.error);     
     
      const { validity, controls, perte, coffre} = json

      if(validity === "OK")
        this.validity = true

      this.perte = perte
      this.coffre = coffre
      this.messages = controls      

      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      } finally{
        this.refreshDatas()
      }
    },
    refreshDatas() {
      this.isBusy = false;
      this.isUploading = false
      this.rectoPreview = null
      this.versoPreview = null
      this.recto = null
      this.verso = null
      this.message = null
      this.perte = false
      this.coffre = false
      this.validity = null
      this.info = false
      this.$refs.rectoInput.value=null
      this.$refs.versoInput.value=null
    },
  },
})

export default AriadNext;
</script>

<style lang="scss" scoped>
.file-upload {
  display: none;
}

h2 {
  text-align: center;
}

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: #A7CDEE;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #DDE7F0; /* when mouse over to the drop zone, change color */
  }

  & p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

  & img {
    width: 30em;
    max-width: 80%;
  }
}

.inputs {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  width: 100%;

  & > * {
    margin: 10px;
    width: 80%;
  }

  @include media-breakpoint-up(lg) {
    flex-flow: row wrap;
    & > * {
      width: 30%;
    }
  }
}

.number-input {
  display: flex;
  flex-flow: column nowrap;

  & img {
    width: 30em;
    max-width: 80%;
  }
}

.id-number-label {
  margin: 10px;
}

.id-number {
  font-family: monospace;
  width: 22em;
  max-width: 100%;
  display: block;
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
