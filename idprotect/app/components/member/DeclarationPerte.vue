<template>
  <div>
    <form enctype="multipart/form-data" @submit.prevent="onSubmit">
      <div class="inputs">
        <div class="dropbox" @click="() => this.$refs.idInput.click()">
          <input
            type="file"
            name="image"
            :disabled="isUploading"
            class="file-upload"
            accept="image/jpeg, image/png, application/pdf"
            ref="idInput"
            @change="changeFile"
          />

          <p v-if="!isUploading && !file">
            Cliquez ici pour sélectionner votre {{ name }}.
          </p>
          <div v-else-if="file">
            <p>{{ file.name }}</p>
            <img v-if="idPreview" :src="idPreview" :alt="`Votre ${name}`" />
            <p v-else>Chargement de l'image...</p>
          </div>
          <p v-else>Envoi de votre photo...</p>
        </div>

        <div class="dropbox" @click="() => this.$refs.pvInput.click()">
          <input
            type="file"
            name="pv"
            :disabled="isUploading"
            class="file-upload"
            accept="image/jpeg, image/png, application/pdf"
            ref="pvInput"
            @change="changePv"
          />

          <p v-if="!isUploading && !pv">
            Cliquez ici pour sélectionner le Procès Verbal de police.
          </p>
          <div v-else-if="pv">
            <p>{{ pv.name }}</p>
            <img v-if="pvPreview" :src="pvPreview" alt="Votre Procès Verbal" />
            <p v-else>Chargement du Procès Verbal...</p>
          </div>
          <p v-else>Envoi de votre Procès Verbal...</p>
        </div>
          <b-card
            :img-src=imageSource
            img-alt="`${name} d'une personne lambda.`"
            img-top
            style="max-width: 30rem;"
            class="mb-2"
            border-variant="primary"
          >
            <template v-slot:footer>
            <b-form-input id="numero" type="text" v-model="number" size="sm" required class="mb-2" :placeholder="`Numéro de votre ${name}`" :minlength="length" :maxlength="length"></b-form-input>
            <b-button type="submit" variant="secondary" block>
              Déclarer la perte de votre {{ name }}
            </b-button>
            </template>
          </b-card>

      </div>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import { Action } from '~/components/enums/action'
import { saveLostDocuments } from "~/api/document";
import mixinUser from "~/mixins/mixinUser";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

const DeclarationPerte = Vue.extend({
  name: "DeclarationPerte",
  mixins: [mixinUser, mixinMessages],

  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => {
        return ["id", "passport", "driving-licence"].includes(value)
      },
    },
    name: { type: String, required: true },
    imageSource: { type: String, required: true },
    placeholder: { type: String, required: false, default: "" },
    length: { type: Number, required: true },
  },

  data() {
    return {
      isUploading: false,
      idPreview: null,
      pvPreview: null,
      file: null,
      number: "",
      pv: null,
    };
  },
  methods: {
    async changeFile(event) {
      const { files, name } = event.target;
      this.file = files[0];

      this.idPreview = null;

      if (!this.file) {
        return;
      }

      const reader = new FileReader()
      reader.onload = async (event) => (this.idPreview = event.target.result)
      reader.readAsDataURL(this.file)
    },

    async changePv(event) {
      const { files, name } = event.target;
      this.pv = files[0];

      this.pvPreview = null;

      if (!this.pv) {
        return;
      }
      const reader = new FileReader()
      reader.onload = async (event) => (this.pvPreview = event.target.result)
      reader.readAsDataURL(this.pv)
    },

    async onSubmit() {
      if (!this.file)
        return this.makeToast('Anomalie', `Sélectionnez une photo de votre ${this.name}`, TOAST_MESSAGE_VARIANT.DANGER);

      if (!this.pv)
        return this.makeToast('Anomalie', "Sélectionnez une photo du procès verbal de police", TOAST_MESSAGE_VARIANT.DANGER);
      
      if (!this.number)
        return this.makeToast('Anomalie', `Précisez le numéro de votre ${this.name}`, TOAST_MESSAGE_VARIANT.DANGER);

      let result;
      try {
        result = await saveLostDocuments(this.$store.state.authentication.type, Action.DECLARATION_PERTE, this.number, this.file, this.pv, this.type)
      } catch (e) {
        return this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }

      if (result.status === 401) {
        this.logout()
      }
      
      if (result.status === 413) {
        return this.makeToast('Anomalie', "Vous avez dépassé la taille maximum de 10Mo pour vos deux fichiers.", TOAST_MESSAGE_VARIANT.DANGER);        
      }

      const json = await result.json()

      if (json.error) {
        return this.makeToast('Anomalie', json.error, TOAST_MESSAGE_VARIANT.DANGER);   
      }

      this.makeToast('Succès', "Votre document a bien été déclaré comme perdu !", TOAST_MESSAGE_VARIANT.SUCCESS);
      this.sendNotification(Action.DECLARATION_PERTE , Action.PORTAIL, this.name)

      this.refreshDatas()
    },
    refreshDatas() {
      this.isUploading = false;
      this.idPreview = null;
      this.pvPreview = null;
      this.file = null;
      this.number = "";
      this.pv = null;
    },
  },
})

export default DeclarationPerte;
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
</style>
