<template>
  <div class="Confirmation container py-24">
    <div class="rounded-lg py-8 py-lg-24 px-4 text-center" :class="!error ? 'bg-success' : 'bg-red'">
      <CommonsLoader v-if="isLoading" size="36" color="white" />
      <div v-else>
        <div class="text-white">
          <h1 class="font-weight-bold">
            {{ $t(`confirmation.${error ? 'error' : 'success'}.title`) }}
          </h1>
          <p class="mb-4">
            {{ $t(`confirmation.${error ? 'error' : 'success'}.description`) }}
          </p>
        </div>
        <CommonsButton
          :content="$t(`confirmation.${error ? 'error' : 'success'}.button`)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLoading: true,
      error: false
    }
  },
  mounted () {
    this.confirmUser()
  },
  methods: {
    confirmUser () {
      const token = this.$route.query.v
      if (!token) {
        this.isLoading = false
        return ''
      }
      this.$api.auth.userConfirmation(token)
        .catch(() => {
          this.error = true
          this.$toast.error(this.$t('errors.common')).goAway(10000)
        })
        .finally(() => { this.isLoading = false })
    }
  }
}
</script>
