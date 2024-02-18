<template>
  <div class="Persona">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <div class="row">
        <div class="col-12">
          <p class="text-primary">
            Votre sexe
          </p>
          <v-radio-group
            v-model="form.sexe"
            class="d-flex align-items-center"
          >
            <v-radio
              v-for="n, nIndex in getGenders"
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
          <v-text-field
            v-model="form.lastname"
            label="Nom de naissance"
            required
            :rules="[() => !!form.lastname || 'Obligatoire']"
            :color="getColorType"
          />
        </div>
        <div class="col-12 col-lg-6">
          <v-text-field
            v-model="form.lastname2"
            label="Deuxième nom de naissance"
            :color="getColorType"
          />
        </div>
      </div>
      <div v-if="form.lastname2" class="row">
        <div class="col-12">
          <p class="text-primary">
            Il s'agit du nom de:
          </p>
          <v-radio-group
            v-model="form.lastnameOrigine"
            class="d-flex align-items-center"
          >
            <v-radio
              v-for="n, nIndex in getLastNameOrigins"
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
          <div v-if="form.lastnameOrigine" class="row">
            <div class="col-12">
              <p class="text-primary">
                Voulez-vous faire apparaître un mot devant le deuxième nom?
              </p>
              <v-radio-group
                v-model="form.prefixeLastname"
                class="d-flex align-items-center"
              >
                <v-radio
                  label="Oui"
                  :color="getColors.primary"
                  :value="true"
                />
                <v-radio
                  label="Non"
                  :color="getColors.primary"
                  :value="false"
                />
              </v-radio-group>
            </div>
            <div v-if="form.prefixeLastname" class="col-12">
              <p class="text-primary">
                Si oui, lequel?
              </p>
              <v-radio-group
                v-model="form.lastnameOrigine"
                class="d-flex align-items-center"
              >
                <v-radio
                  v-for="n, nIndex in getPrefixesLastNames"
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
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-4">
          <v-text-field
            v-model="form.firstname"
            label="Prénom"
            required
            :rules="[() => !!form.firstname || 'Obligatoire']"
            :color="getColorType"
          />
        </div>
        <div class="col-12 col-lg-4">
          <v-text-field
            v-model="form.firstname2"
            label="Deuxième prénom"
            :color="getColorType"
          />
        </div>
        <div class="col-12 col-lg-4">
          <v-text-field
            v-model="form.firstname3"
            label="Troisième prénom"
            :color="getColorType"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
          <v-select
            v-model="form.eyesColor"
            class="cursor-pointer"
            :items="getEyesColor"
            placeholder="Couleur des yeux"
            :rules="[() => !!form.eyesColor || 'Obligatoire']"
            required
          />
        </div>
        <div class="col-12 col-lg-6">
          <p class="mb-1">
            Votre taille: {{ form.heigth }} cm
          </p>
          <v-slider
            v-model="form.heigth"
            hint="Votre taille"
            max="250"
            min="50"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
          <CommonsDatepicker
            :content="{
              model: 'birthdate',
              type: 'date',
              title: 'Votre date de naissance'
            }"
            @onDate="applyDate"
          />
        </div>
        <div class="col-12 col-lg-6">
          <v-text-field
            v-model="form.birthCountryPlace"
            label="Ville de naissance"
            :rules="[() => !!form.birthCountryPlace || 'Obligatoire']"
            :color="getColorType"
          />
        </div>
      </div>
    </v-form>
    <div class="d-flex justify-content-center mt-8">
      <CommonsButton
        :content="{ title: 'Retour', bgColor: 'white', textColor: 'text-primary' }"
        @click.native="$emit('previous')"
      />
      <CommonsButton :content="{ title: 'Suivant', bgColor: 'primary', textColor: 'text-white' }" @click.native="validate" />
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import FormMixin from '@/mixins/FormMixin'

export default {
  mixins: [ErrorMixin, ColorsMixin, FormMixin],
  data () {
    return {
      valid: false,
      form: {
        birthCityPlace: null,
        birthdate: null,
        birthCountryPlace: null,
        eyesColor: null,
        heigth: 50,
        firstname: null,
        firstname2: null,
        firstname3: null,
        lastname: null,
        lastname2: null,
        lastnameOrigine: null,
        prefixeLastname: false, // TO DO hide
        prefixeLastnameValue: null,
        sexe: 'Femme'
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
      this.$emit('success', {
        form: this.form
      })
    }
  }
}
</script>
