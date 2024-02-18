<template>
  <div class="Renew py-16">
    <header class="container text-primary">
      <h1 class="text-32 font-weight-light mb-4">
        {{ $t('renew.title') }}
      </h1>
      <v-alert
        :color="getColors.primary"
        type="info"
        elevation="2"
      >
        <p class="font-weight-light mb-0 ml-2">
          {{ $t('renew.subtitle') }}
        </p>
      </v-alert>
    </header>
    <div class="container text-primary">
      <DeclarationTunnel :content="getSteps" :has-origin="constants.RENOUVELLEMENT" />
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import UserMixin from '@/mixins/UserMixin'

export default {
  mixins: [ColorsMixin, ErrorMixin, UserMixin],
  data () {
    return {
      steps: {}
    }
  },
  computed: {
    getSteps () {
      const model = this.$t('renew')
      return model
    }
  }
}
</script>
