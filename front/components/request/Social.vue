<template>
  <div class="Social container d-flex align-items-center justify-content-between" style="max-width: 350px;">
    <img class="cursor-pointer" src="@/assets/images/icons/facebook.png" alt="linkedin" width="65px" @click="open('https://www.facebook.com/IDProtect2020')">
    <img class="cursor-pointer" src="@/assets/images/icons/linkedin.png" alt="linkedin" width="65px" @click="open('https://www.linkedin.com/company/idprotect')">
    <img class="cursor-pointer" src="@/assets/images/icons/instagram.png" alt="linkedin" width="65px" @click="open('https://www.instagram.com/id_protect/')">
  </div>
</template>

<script>
export default {
  methods: {
    open (url) {
      window.open(url, '_blank')
    }
  }
}
</script>
