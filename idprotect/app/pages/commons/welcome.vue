<template>
  <Welcome />
</template>

<script>
import Vue from "vue"
import Welcome from "~/components/commons/access/Welcome"

const WelcomePage = Vue.extend({
  name: "welcome",
  middleware: "authenticated",
  components: { Welcome }
})

export default WelcomePage
</script>
