<template>
  <div class="ContactForm text-center text-primary p-4">
    <h2 class="font-weight-bold mb-2" v-html="$t('modals.contact.title')" />
    <p v-html="$t('modals.contact.description')" />
    <v-form
      ref="form" 
      lazy-validation
    >
      <div v-for="label, labelIndex in form" :key="labelIndex">
        <v-text-field
          v-if="labelIndex !== 'describe'"
          v-model="form[labelIndex]"
          :label="$t(`login.form.${labelIndex}`)"
          :rules="[() => !!form[labelIndex] || 'Obligatoire']"
          required
        />
        <v-textarea
          v-else
          v-model="form.describe"
          :label="$t(`login.form.describe`)"
          filled
          :rules="[() => !!form[labelIndex] || 'Obligatoire']"
          required
        />
      </div>
      <div
        v-for="check, checkIndex in $t('modals.contact.inputs')"
        :key="checkIndex"
        class="d-flex align-items-center text-left text-12 mb-3"
      >
        <v-simple-checkbox
          v-model="checks[checkIndex]"
          :label="check"
        />
        <p class="mb-0 ml-2" v-html="check" />
      </div>
    </v-form>
    <CommonsButton :content="{...$t('modals.contact.button'), disabled: isDisabled, loading: isLoading}" @click.native="sendForm" />
  </div>
</template>

<script>
import ColorsMixin from '../../mixins/ColorsMixin'
import ErrorMixin from '../../mixins/ErrorMixin'

export default {
  mixins: [ColorsMixin, ErrorMixin],
  data () {
    return {
      checks: {
        allowContact: false,
        allowPolicy: false
      },
      form: {
        firstName: undefined,
        lastName: undefined,
        mail: undefined,
        numberOption: undefined,
        describe: undefined
      },
      isLoading: false
    }
  },
  computed: {
    isDisabled () {
      if (this.validateEmail(this.form.mail) && this.checks.allowPolicy) {
        return false
      }
      return true
    }
  },
  methods: {
    sendForm () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.isLoading = true
      // envoyer le form ici

      this.$mail.send({
        from: this.form.mail,
        subject: `Contact idprotect.fr: ${this.form.firstName || ''} ${this.form.lastName || ''}`,
        text: `Informations de contact:<br><br>Nom: ${this.form.firstName || ''} ${this.form.lastName || ''}<br>E-mail: ${this.form.mail || ''}<br>Numéro: ${this.form.numberOption || ''}<br><br>${this.form.describe || ''}`
      })
        .then(() => {
          this.$modal.hide('contact-modal')
          this.$toast.success('Votre demande a bien été envoyée. Nous vous recontacterons d\'ici peu.').goAway(10000)
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
