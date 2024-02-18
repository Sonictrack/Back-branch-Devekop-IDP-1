<template>
  <div class="Info">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <div class="row">
        <div class="col-12 pb-0">
          <v-text-field
            v-model="form.phoneNumber"
            type="number"
            label="Numéro de téléphone"
            :color="getColorType"
            :rules="[() => !!form.phoneNumber || 'Obligatoire']"
            required
          />
        </div>
        <div v-if="!getCurrentUser" class="col-12 p-0">
          <div class="col-12">
            <v-text-field
              v-model="form.email"
              label="Votre adresse e-mail"
              :rules="[() => !!validateEmail(form.email) || 'Obligatoire']"
              :color="getColorType"
            />
          </div>
          <div class="col-12">
            <v-text-field
              v-model="form.password"
              type="password"
              label="Votre mot de passe"
              :rules="[() => !!checkPassword(form.email) || 'Obligatoire']"
              :color="getColorType"
            />
          </div>
          <div class="col-12">
            <v-text-field
              v-model="form.passwordConfirm"
              type="password"
              label="Confirmation de votre mot de passe"
              :rules="[() => (form.password == form.passwordConfirm) || 'Vos mots de passes doivent correspondre']"
              :color="getColorType"
            />
          </div>
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
import UserMixin from '@/mixins/UserMixin'

export default {
  mixins: [ErrorMixin, ColorsMixin, FormMixin, UserMixin],
  data () {
    return {
      valid: false,
      form: {
        phoneNumber: null
      }
    }
  },
  methods: {
    async validate () {
      if (!this.$refs.form.validate()) {
        return
      }
      if (!this.getCurrentUser) {
        this.isLoading = true
        // check email first
        await this.$api.user.checkEmail(this.form.email)
          .then(() => {
            this.$emit('success', {
              form: this.form
            })
          })
          .catch(({ response }) => {
            this.$toast.error(response.data.error).goAway(10000)
          })
          .finally(() => { this.isLoading = false })
      } else {
        this.$emit('success', {
          form: this.form
        })
      }
    }
  }
}
</script>
