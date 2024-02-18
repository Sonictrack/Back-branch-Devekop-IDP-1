<template>
  <div class="FormPersona w-100">
    <div class="d-flex flex-column flex-md-row">
      <div class="col-12 col-lg-6">
        <v-text-field
          v-model="form.Lastname"
          label="Nom de naissance"
          required
          :rules="[() => !!form.Lastname || 'Obligatoire']"
          :color="getColorType"
          @input="sendData"
        />
      </div>
    </div>
    <div class="d-flex flex-column flex-md-row">
      <div class="col-12 col-lg-4">
        <v-text-field
          v-model="form.Firstname"
          label="Prénom"
          required
          :rules="[() => !!form.Firstname || 'Obligatoire']"
          :color="getColorType"
          @input="sendData"
        />
      </div>
      <div class="col-12 col-lg-4">
        <v-text-field
          v-model="form.Firstname2"
          label="Deuxième prénom"
          :color="getColorType"
          @input="sendData"
        />
      </div>
      <div class="col-12 col-lg-4">
        <v-text-field
          v-model="form.Firstname3"
          label="Troisième prénom"
          :color="getColorType"
          @input="sendData"
        />
      </div>
    </div>
    <div class="d-flex flex-column flex-md-row">
      <div class="col-12 col-lg-6">
        <CommonsDatepicker
          :content="{
            model: 'birthdate',
            type: 'date',
            title: 'Date de naissance'
          }"
          @onDate="applyDate"
        />
      </div>
    </div>
    <div class="d-flex flex-column flex-md-row">
      <div class="col-12 col-lg-4">
        <v-select
          v-model="form.BirthCountryPlace"
          class="cursor-pointer"
          :items="getAreaPlace"
          placeholder="Où?"
          :rules="[() => !!form.BirthCountryPlace || 'Obligatoire']"
          required
          @input="sendData"
        />
      </div>
      <div class="col-12 col-lg-4">
        <v-text-field
          v-model="form.BirthCityPlace"
          label="Ville"
          :color="getColorType"
          :rules="[() => !!form.BirthCityPlace || 'Obligatoire']"
          required
          @input="sendData"
        />
      </div>
      <div class="col-12 col-lg-4">
        <v-text-field
          v-model="form.Nationality"
          label="Nationalité"
          :color="getColorType"
          :rules="[() => !!form.Nationality || 'Obligatoire']"
          required
          @input="sendData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { forEach } from 'lodash'
import ColorsMixin from '../../mixins/ColorsMixin'
import FormMixin from '../../mixins/FormMixin'

export default {
  mixins: [ColorsMixin, FormMixin],
  props: {
    origin: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      form: {
        Lastname: null,
        Firstname: null,
        Firstname2: null,
        Firstname3: null,
        Birthdate: null,
        BirthCountryPlace: null,
        BirthCityPlace: null,
        Nationality: null
      }
    }
  },
  methods: {
    applyDate (e) {
      if (e.date && e.model) {
        this.form.Birthdate = e.date
      }
    },
    sendData () {
      if (!this.origin) {
        return
      }
      const newForm = {}
      forEach(this.form, (x, i) => {
        newForm[`${this.origin}${i}`] = x
      })
      this.$emit('onInput', newForm)
    }
  }
}
</script>
