<template>
  <Confirmation />
</template>

<script>
import Vue from "vue"
import Verification from "~/components/commons/access/Verification"

const VerificationPage = Vue.extend({
  name: "verification",
  middleware: "notAuthenticated",
  components: { Verification }
})

export default VerificationPage
</script>
