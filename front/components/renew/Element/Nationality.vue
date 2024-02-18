<template>
  <div class="Nationality">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <p class="text-primary">
        Vous êtes français(e) parce que:
      </p>
      <v-checkbox
        v-for="nat, natIndex in getNationalityOptions"
        :key="natIndex"
        v-model="form.nationality"
        :label="nat.text"
        :value="nat.value"
        :rules="[() => form.nationality.length > 0 || 'Obligatoire']"
        class="mb-0 pb-0"
      />
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
        nationality: []
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
