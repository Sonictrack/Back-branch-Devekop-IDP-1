<template>
  <div class="NewStart">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <div class="row">
        <div class="col-12 col-lg-6">
          <p class="text-primary">
            La demande concerne un:
          </p>
          <v-radio-group
            v-model="form.personType"
            class="d-flex align-items-center"
          >
            <v-radio
              v-for="n, nIndex in getPersonsOptions"
              :key="nIndex"
              :color="getColors.primary"
              :value="n.value"
            >
              <template #label>
                <p class="ml-2 m-0">
                  {{ n.text }}
                </p>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <div class="col-12 col-lg-6">
          <p class="text-primary">
            Pour un un:
          </p>
          <v-radio-group
            v-model="form.documentType"
            class="d-flex align-items-center"
          >
            <v-radio
              v-for="n, nIndex in getDocumentTypes"
              :key="nIndex"
              :color="getColors.primary"
              :value="n.value"
            >
              <template #label>
                <p class="ml-2 m-0">
                  {{ n.text }}
                </p>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
          <v-select
            v-if="form.documentType === 'Carte_Identite'"
            v-model="form.idCardReason"
            class="cursor-pointer"
            :items="getCidReasons"
            placeholder="Précisez la raison"
            :rules="[() => !!form.idCardReason || 'Obligatoire']"
            required
          />
          <v-select
            v-else
            v-model="form.passeportReason"
            class="cursor-pointer"
            :items="getPassportReasons"
            placeholder="Précisez la raison"
            :rules="[() => !!form.passeportReason || 'Obligatoire']"
            required
          />
        </div>
        <div class="col-12 col-lg-6">
          <v-select
            v-model="form.departement"
            class="cursor-pointer"
            :items="getDepartments"
            placeholder="Département où se fera la demande"
            :rules="[() => !!form.departement || 'Obligatoire']"
            required
          />
        </div>
      </div>
      <div class="row">
        <div v-if="form.passeportReason !== 'Premiere_demande' && form.idCardReason !== 'Premiere_demande'" class="col-12 row">
          <div class="col-lg-6 col-12">
            <v-text-field
              v-model="form.documentNumber"
              label="N° de la pièce"
              :maxlength="form.documentType === 'Passeport' ? 9 : 12"
              required
              :rules="[v => (v && checkValue(v, form.documentType)) || `Le numéro doit avoir au moins ${form.documentType === 'permis' ? '6' : '9'} ${form.documentType === 'Passeport' ? 'caractères.' : 'caractères et maximum 12 caractères.'}`]"
              :color="getColorType"
            />
          </div>
          <div v-if="form.documentType === 'Carte_Identite'" class="col-lg-6 col-12">
            <p class="text-primary">
              Je suis en possession du document
            </p>
            <v-radio-group
              v-model="form.oldDocumentPossession"
              class="d-flex align-items-center"
              row
            >
              <v-radio
                v-for="n, nIndex in yesNo"
                :key="nIndex"
                :color="getColors.primary"
                :value="n.value"
                required
                :rules="[() => !!form.oldDocumentPossession || 'Obligatoire']"
              >
                <template #label>
                  <p class="ml-2 m-0">
                    {{ n.text }}
                  </p>
                </template>
              </v-radio>
            </v-radio-group>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
          <v-text-field
            v-model="form.authority"
            label="Autorité ayant délivré la pièce"
            required
            :rules="[() => !!form.authority || 'Obligatoire']"
            :color="getColorType"
          />
        </div>
        <div class="col-12 col-lg-6">
          <CommonsDatepicker
            :content="{
              model: 'dateDeliverance',
              type: 'date',
              title: 'Date de délivrance'
            }"
            @onDate="applyDate"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
          <CommonsDatepicker
            :content="{
              model: 'dateExpiration',
              type: 'date',
              title: 'date d\'expiration'
            }"
            @onDate="applyDate"
          />
        </div>
      </div>
    </v-form>
    <div class="d-flex justify-content-center mt-8">
      <CommonsButton :content="{ title: 'Suivant', bgColor: 'primary', textColor: 'text-white', loading: isLoading }" @click.native="validate" />
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import FormMixin from '@/mixins/FormMixin'
import UserMixin from '@/mixins/UserMixin'

export default {
  mixins: [ErrorMixin, ColorsMixin, FormMixin, UserMixin],
  data () {
    return {
      valid: false,
      isLoading: false,
      form: {
        personType: 'Adulte',
        documentType: 'Passeport',
        documentNumber: null,
        departement: null,
        oldDocumentPossession: false,
        authority: null,
        dateDeliverance: null,
        dateExpiration: null
      }
    }
  },
  methods: {
    applyDate (e) {
      if (e.date && e.model) {
        this.form[e.model] = e.date
      }
    },
    validate () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.isLoading = true
      this.$api.documents[this.getCurrentUser ? 'lockDocument' : 'lockDocumentAnon'](this.form.documentNumber, this.getCurrentUser ? this.getCurrentUser.type : null)
        .then((response) => {
          if (response.success === true) {
            this.$emit('success', {
              form: this.form
            })
          } else {
            this.$toast.error('Ce numéro d\'identifiant est déjà déclaré.').goAway(10000)
          }
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.error).goAway(10000)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
