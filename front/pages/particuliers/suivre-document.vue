<style>
.blue-theme {
  padding-top: 50px;
}
</style>

<template>
  <div class="blue-theme">
    <section class="section__area border-bottom border-pink pb-2">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="hero__text">
              <h1>ID Tracker</h1>
              <p>
                Vous souhaitez être averti lorsque vos <br />documents sont
                présentés chez nos partenaires?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section__area">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 class="font-weight-light mb-3 raleway text-uppercase">
              Enregistrer mon document
            </h1>
            <p class="font-weight-light f-24">
              ID <span class="text-uppercase">Protect</span> vous envoie une alerte à chaque fois que votre document
              est présenté chez nos partenaires
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="verify__box">
              <div class="button__list">
                <button @click="() => this.type = 'id'" :class="this.classes('id')" class="text-uppercase">
                Carte d'identité
                </button>
                <button @click="() => this.type = 'passeport'" :class="this.classes('passeport')">Passeport</button>
                <button @click="() => this.type = 'permis'" :class="this.classes('permis')" class="text-uppercase">
                  Permis de conduire
                </button>
                <button @click="() => this.type = 'sejour'" :class="this.classes('sejour')" class="text-uppercase">
                  Titre de séjour
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-8 mx-auto">
            <div class="verify__box mt-0">
              <div class="verify__body">
                <div v-if="isLoading" class="d-flex flex-column align-items-center justify-content-center" style="min-height: 300px;">
                  <p>{{textLoading}}</p>
                  <CommonsLoader size="54" :color="getColors.secondary"/>
                </div>
                <div v-if="!isLoading">
                  <h2>Exemple :</h2>
                  <img v-if="this.type ==='id'" src="@/assets/images/cards/id_card.png" alt="Carte d'identité" style="max-width: 70%;" />
                  <img v-if="type === 'passeport'" src="@/assets/images/cards/passport.png" alt=" Passeport" style="max-width: 70%;" />
                  <img v-if="this.type === 'permis'" src="@/assets/images/cards/driving-licence.png" alt="Permis de conduire" style="max-width: 70%;" />
                  <img v-if="this.type === 'sejour'" src="@/assets/images/cards/residence_permit.jpeg" alt="Titre de séjour" style="max-width: 70%;" />
                </div>
                <div class="verify__body__input">
                  <h2>Activer le suivi sur le document numéro :</h2>
                          <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
                  <v-text-field
                  v-model="documentId"
                  :maxlength="this.type === 'passport' ? 9 : 12"
            class="centered-input"
            :color="getColors[getClassColor]"
              :rules="[() => !!this.isDocumentIdFilled || 'Obligatoire',
                     v => checkValue(v, this.type) || `Le numéro doit avoir au moins ${this.type === 'permis' ? '6' : '9'} ${this.type === 'passport' ? 'caractères.' : 'caractères et maximum 12 caractères.'}`]"

                  />
                  </v-form>
                  <button :disabled="!this.isDocumentIdFilled" @click="this.followDocument" class="btn btn-pink text-uppercase mt-4" style="display: block">
                    <i class="fas fa-search fa-flip-horizontal"></i>Activer le suivi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import UserMixin from '../../mixins/UserMixin'
import MessagesMixin from '../../mixins/MessagesMixin'
import { addFollowingDocument } from './../../api/followed-documents'
import ErrorMixin from '@/mixins/ErrorMixin'
import ColorsMixin from '@/mixins/ColorsMixin'

export default {
  name: 'SuivreDocument',
  middleware: "auth",
  mixins: [UserMixin, MessagesMixin, ColorsMixin, ErrorMixin],
  methods: {
    async followDocument () {
      this.isLoading = true
      const response = await addFollowingDocument(
        this.getCurrentUser.type,
        this.documentId,
        this.type
      )
      this.documentLoading()
      const json = await response.json()
      console.log(json);
      if (response.status !== 200) {
        this.makeToast('Anomalie', json.error)
        this.isLoading = false
        return
      }

      this.makeToast('Succès', 'Votre document est maintenant suivi !', 'success')
      this.$router.push(`mes-documents`)
      this.isLoading = false
    },
    classes (btnType) {
      if (btnType === this.type) {
        return 'btn btn-pink text-uppercase'
      }

      return 'btn btn-border text-uppercase'
    },
    documentLoading () {
      let i = 0
      this.interval = setInterval(() => {
        this.textLoading = this.texts[(i = (i + 1) % this.texts.length)]
      }, 3000)
    }
  },
  data: () => {
    return {
      documentId: '',
      type: 'id',
      isLoading: undefined,
      interval: null,
      number: undefined,
      valid: false,
      textLoading: 'Vérification du document...',
      texts: [
        'Vérification du document...',
        'Consultation de la base ID PROTECT (documents perdus et volés)...',
        'Consultation ID Tracker (documents suivis)...'
      ]
    }
  },
  computed: {
    isDocumentIdFilled () {
      return this.documentId.length > 0
    }
  }
}
</script>
