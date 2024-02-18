<template>
  <div>
    <v-app>
      <Navbar />
      <transition name="slide" mode="out-in">
        <div class="overflow-hidden" style="padding-top:20px;">
          <Nuxt />
        </div>
      </transition>
      <Footer />
    </v-app>
  </div>
</template>

<script>
export default {
  head () {
    return {
      bodyAttrs: {
        class: this.$route.path.includes('professionnels') ? '' : 'blue'
      }
    }
  },
  watch: {
    $route: {
      handler () {
        this.$scrollTo('#__layout', 0, { force: true })
      }
    }
  },
  mounted () {
    // Auth : fetch if type in local storage set, catch error here
    this.$api.auth.authStateChange()
  }
}
</script>

<style>
  body {
    font-family: 'Raleway'!important;
  }
</style>
