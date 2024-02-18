<template>
  <div class="PerteVol py-16">
    <header class="container text-primary">
      <h1 class="text-32 font-weight-light mb-4">
        {{ $t('declare.notLoggedIn.title') }}
      </h1>
      <p class="text-16 text-primary">
        {{ $t('declare.notLoggedIn.subtitle') }}
      </p>
      <v-alert
        :color="getColors[getCurrentUser ? 'primary' : 'orange']"
        type="info"
        elevation="2"
        dismissible
      >
        <div v-if="getCurrentUser" class="mb-0 ml-2">
          <h3 class="text-24 font-weight-light mb-2">
            {{ $t('declare.loggedIn.title') }}
          </h3>
          <p class="text-16 font-weight-light mb-0">
            {{ $t('declare.loggedIn.subtitle') }}
          </p>
        </div>
        <p v-else class="mb-0 ml-2">
          {{ $t('declare.notLoggedIn.warning') }}.
        </p>
      </v-alert>
    </header>
    <Login v-if="!getCurrentUser" />
    <div v-else class="container text-primary">
      <DeclarationTunnel :content="$t('declare.lost')" :has-origin="constants.DECLARATION_PERTE" />
    </div>
  </div>
</template>

<script>
import constants from '@/constants'
import ColorsMixin from '@/mixins/ColorsMixin'
import UserMixin from '@/mixins/UserMixin'

export default {
  mixins: [ColorsMixin, UserMixin],
  data () {
    return {
      constants
    }
  }
}
</script>
