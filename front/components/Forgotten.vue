<template>
  <div class="Forgotten p-2 p-lg-6" :class="getTextColor">
    <h3 class="text-24">
      {{ $t('login.forgotten.title') }}
    </h3>
    <v-text-field
      v-model="email"
      :color="getColorType"
    />
    <p class="inline-block text-12 my-4 cursor-pointer text-decoration-underline" @click="$emit('close')">
      {{ $t('login.forgotten.back') }}
    </p>
    <CommonsButton
      width="100%"
      :content="{ ...$t('login.forgotten.button'), bgColor: getClassColor, loading: isLoading }"
      @click.native="sendMail"
    />
  </div>
</template>

<script>
import ColorMixins from '../mixins/ColorsMixin'

export default {
  mixins: [ColorMixins],
  props: {
    pro: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      email: undefined,
      isLoading: false
    }
  },
  methods: {
    sendMail () {
      this.isLoading = true
      this.$api.user.resend({
        email: this.email
      })
        .then(({ success }) => {
          this.$toast.success(success).goAway(10000)
        })
        .catch(err => this.dispatchError('login', err.response.status))
        .finally(() => { this.isLoading = false })
    }
  }
}
</script>
