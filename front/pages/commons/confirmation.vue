<template>
  <div class="CommonsConfirmation">
    Redirection...
  </div>
</template>

<script>
export default {
  mounted () {
    this.$router.push({
      path: '/confirmation/',
      query: {
        v: this.$route.query.v
      }
    })
  }
}
</script>
