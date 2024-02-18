<template>
  <div class="Address">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <div class="row">
        <div class="col-12 col-lg-4">
          <v-text-field
            v-model="form.streetNumber"
            type="number"
            label="Numéro de la voie"
            :color="getColorType"
          />
        </div>
        <div class="col-12 col-lg-4">
          <v-select
            v-model="form.streetExtension"
            class="cursor-pointer"
            :items="getStreetExtensions"
            placeholder="Extension"
            required
          />
        </div>
        <div class="col-12 col-lg-4">
          <v-select
            v-model="form.streetType"
            class="cursor-pointer"
            :items="getStreetTypes"
            placeholder="Type de voie"
            required
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <v-text-field
            v-model="form.streetName"
            label="Nom de la voie"
            :rules="[() => !!form.streetName || 'Obligatoire']"
            :color="getColorType"
            required
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <v-text-field
            v-model="form.streetComplement"
            label="Complément d'adresse"
            :color="getColorType"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
          <v-text-field
            v-model="form.zipCode"
            type="number"
            label="Code postal"
            :color="getColorType"
            :rules="[() => !!form.zipCode || 'Obligatoire']"
            required
          />
        </div>
        <div class="col-12 col-lg-6">
          <v-text-field
            v-model="form.city"
            label="Commune"
            :color="getColorType"
            :rules="[() => !!form.city || 'Obligatoire']"
            required
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
        streetNumber: null,
        streetExtension: null,
        streetType: null,
        streetName: null,
        streetComplement: null,
        zipCode: null,
        city: null
      }
    }
  },
  methods: {
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
