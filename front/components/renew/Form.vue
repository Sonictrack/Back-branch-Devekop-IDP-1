<template>
  <!-- Origin Adjicreative, attempt to remade by G.D -->
  <div id="Renew" class="RenewForm mb-4">
    <v-progress-linear :value="getCurrentProgress" />
    <div
      v-for="step, stepIndex in steps"
      :key="stepIndex"
      class="mt-8 mx-auto"
      :style="step.component === 'RenewElementSaveDoc' ? '' : 'max-width: 600px'"
    >
      <transition name="slide" mode="out-in">
        <component
          :is="step.component"
          v-if="currentStep === stepIndex"
          :has-form="form"
          @success="nextStep"
          @previous="previousStep"
          @goToPayment="closeForm"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import FormMixin from '@/mixins/FormMixin'

export default {
  mixins: [ColorsMixin, FormMixin],
  data () {
    return {
      currentStep: 0,
      form: {},
      steps: [
        {
          component: 'RenewElementNewStart'
        }, {
          component: 'RenewElementPersona'
        }, {
          component: 'RenewElementFiliation'
        }, {
          component: 'RenewElementNationality'
        }, {
          component: 'RenewElementAddress'
        }, {
          component: 'RenewElementInfo'
        }, {
          component: 'RenewElementSaveDoc'
        }, {
          component: 'RenewElementEnd'
        }
      ]
    }
  },
  computed: {
    getCurrentProgress () {
      return (this.currentStep + 1) * 100 / this.steps.length + 1
    },
    getCurrentStep () {
      return this.steps[this.currentStep]
    }
  },
  watch: {
    currentStep: {
      handler () {
        this.$scrollTo('#Renew', 0, { force: true, offset: -200 })
      }
    }
  },
  methods: {
    closeForm () {
      this.$emit('success', {
        form: this.form
      })
    },
    previousStep () {
      if (this.currentStep === 0) { return }
      this.currentStep--
    },
    nextStep (e) {
      if (this.currentStep < this.steps.length) {
        if (this.form) {
          if (this.form.passeportReason === 'Premiere_demande' || this.form.idCardReason === 'Premiere_demande') {
            this.currentStep = this.currentStep + 1
            this.form.lockDocument = false
          }
        }
        this.currentStep++
      }
      if (e.form) {
        this.form = { ...this.form, ...e.form }
      }
    }
  }
}
</script>
