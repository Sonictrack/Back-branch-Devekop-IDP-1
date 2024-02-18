<template>
  <div class="DeclarationTunnel">
    <v-stepper v-model="currentStep">
      <template v-for="step, stepIndex in content.steps">
        <div :key="stepIndex">
          <v-stepper-step
            :complete="isComplete"
            :step="stepIndex + 1"
            :color="getColors.primary"
          >
            <span class="ml-2" :class="currentStep === stepIndex + 1 ? getTextColor : ''">{{ step.name }}</span>
          </v-stepper-step>
          <v-stepper-content class="overflow-auto px-2 px-lg-4" :step="stepIndex + 1">
            <component
              :is="step.component"
              :current-step="currentStep"
              :has-form="form"
              :has-back-button="true"
              :has-origin="hasOrigin"
              @success="updateStep"
              @previous="previousStep"
            />
          </v-stepper-content>
        </div>
      </template>
    </v-stepper>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import FormMixin from '@/mixins/FormMixin'

export default {
  mixins: [ColorsMixin, FormMixin],
  props: {
    content: {
      default: () => {},
      type: Object
    },
    hasOrigin: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      currentStep: 1,
      form: {},
      isDisabled: true,
      isLoading: false
    }
  },
  computed: {
    isComplete () {
      return false
    }
  },
  methods: {
    previousStep () {
      if (this.currentStep !== 0) {
        this.currentStep--
      }
    },
    updateStep (e) {
      if (this.currentStep <= this.content.steps.length) {
        this.currentStep++
      }
      if (e && e.form) {
        this.form = e.form
      }
    }
  }
}
</script>
