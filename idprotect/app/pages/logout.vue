<template>

</template>

<script>
  export default {
    name: 'logout',
    async beforeCreate () {
      await this.$store.dispatch('authentication/logout')
      this.$toast.success('Vous êtes désormais déconnecté.', {
        duration: 3000,
        icon: 'check',
        iconPack: 'fontawesome'
      })
      this.$router.replace('/')
    }
  }
</script>