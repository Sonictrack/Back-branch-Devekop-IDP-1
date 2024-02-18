<template>
  <div class="Filiation">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <div class="row">
        <div class="col-12">
          <p class="text-primary">
            Père inconnu?
          </p>
          <v-radio-group
            v-model="form.father"
            class="d-flex align-items-center"
          >
            <v-radio
              v-for="n, nIndex in yesNo"
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
      <div v-if="form.father !== 'Oui'" class="row">
        <CommonsFormPersona origin="father" @onInput="applyData" />
      </div>
      <div class="row">
        <div class="col-12">
          <p class="text-primary">
            Mère inconnue?
          </p>
          <v-radio-group
            v-model="form.mother"
            class="d-flex align-items-center"
          >
            <v-radio
              v-for="n, nIndex in yesNo"
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
      <div v-if="form.mother !== 'Oui'" class="row">
        <CommonsFormPersona origin="mother" @onInput="applyData" />
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
        father: 'Non',
        mother: 'Non'
      }
    }
  },
  methods: {
    applyData (data) {
      if (data) {
        this.form = { ...this.form, ...data }
      }
    },
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
