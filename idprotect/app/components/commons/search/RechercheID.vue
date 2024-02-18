<template>
  <div>
    <form class="form" @submit.prevent="getLocation">
      <div class="card text-center mt-3">
        <div class="card-header bg-secondary">
  
        </div>
        <div class="card-body">
          <div v-if="!(searchedForNumber && cardsExists) || searching">
            <p>Exemple :</p>
            <img
              :src="imageSource"
              alt="Carte d'identité d'une personne lambda. La seconde ligne du numéro est soulignée par un trait rouge."
            />
          </div>
          <div v-else-if="cardsExists && searchedForNumber">
            <span class="text-success">
              <span>Document déclaré perdu le {{ dateString }}.</span><br>
              <span v-if="pvIsImage">Voici le Procès Verbal de Police :</span>
              <span v-else
                >Le téléchargement du Procès Verbal de Police a commencé. Sinon,
                <a :href="pvUrl" class="dl-link" target="_blank">cliquez ici</a
                >.</span
              >
            </span>
          </div>
        </div>
        <div class="card-footer text-muted">
          <div>
          <label id="id-number-label">
            Numéro du document recherché :

            <!-- The placeholder is the number on the fake example card -->
            <input
              id="cardNumber"
              name="cardNumber"
              v-model="cardNumber"
              :placeholder="placeholder"
              :minlength="length"
              :maxlength="length"
              type="text"
              class="cardNumberInput"
              required
            />
          </label>
          </div>
          <button type="submit" class="btn btn-primary" id="submit-button">
            Rechercher ce document
          </button>
        </div>
      </div>


    </form>
  </div>
</template>

<script>
import { searchLostDocument, getPvUrl } from "~/api/document";
import { recordPosition } from "~/api/position";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { Action } from "~/components/enums/action";
import mixinUser from '../../../mixins/mixinUser';

export default {
  name: "RechercheID",
  mixins: [mixinMessages, mixinUser],
  props: {
    placeholder: { type: String, required: false, default: "" },
    length: { type: Number, required: true },
    type: { type: String, required: true },
    imageSource: { type: String, required: true },
  },

  data() {
    return {
      pvUrl: null,
      pvIsImage: null,
      cardsExists: false,
      searchedForNumber: false,
      date: null,
      cardNumber: "",
      searching: false,
    };
  },
  mounted() {
    this.checkUser().then((result) => {
        if(!result)
          this.logout()
      })
  },
  computed: {
    dateString() {
      return this.date.toLocaleString("fr-FR");
    },
  },
  methods: {
    getLocation() {
      if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this.onSubmit, this.onFailure);
      else
        this.makeToast('Anomalie', "La recherche nécéssite d'autoriser la géolocalisation.", TOAST_MESSAGE_VARIANT.DANGER);   
    },
    onFailure(err) {
      this.makeToast('Anomalie', "La recherche nécéssite d'autoriser la géolocalisation.", TOAST_MESSAGE_VARIANT.DANGER);   
    },
    async onSubmit(position) {
      try {
        const response = await searchLostDocument(this.$store.state.authentication.type, this.cardNumber, this.type);
        if(response.status === 401)
          this.logout()

        const json = await response.json();

        if (json.success) {
          this.makeToast('Succès', json.success, TOAST_MESSAGE_VARIANT.SUCCESS);
          return;
        }

        if (json.error && !json.clientNumber) {
          throw new Error(json.error);
        }
        
        const numeroIndividualClient = json.clientNumber;

        let resultPosition = await recordPosition(
          this.$store.state.authentication.type,
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            to: numeroIndividualClient,
            action: Action.RECHERCHE_ID,
          }
        );

        this.sendNotification(Action.RECHERCHE_ID, numeroIndividualClient, `Document numéro ${this.cardNumber}`);
        this.makeToast('Anomalie', json.error, TOAST_MESSAGE_VARIANT.DANGER);
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
  },
};
</script>

<style scoped>
.form {
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  max-width: 600px;
}

.card {
  width: 600px;
}

.cardNumberInput {
  width: 22em;
  max-width: 100%;
  display: block;
  font-family: monospace;
}

img {
  width: 30em;
  max-width: 90%;
}

.dl-link {
  color: blue;
}
</style>
