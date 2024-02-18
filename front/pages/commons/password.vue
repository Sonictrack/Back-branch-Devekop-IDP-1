<template>
  <div class="CommonsPassword">
    Redirection...
  </div>
</template>

<script>
export default {
  mounted () {
    this.$router.push({
      path: '/password/',
      query: {
        p: this.$route.query.p
      }
    })
  }
}
</script>
