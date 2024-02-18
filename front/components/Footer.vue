<template>
  <footer class="footer-alt py-16" :class="getBackgroundColor === 'bg-primary' ? 'footer-primary': 'footer-secondary' ">
    <div class="container mx-auto text-center">
      <h3 class="text-2xl text-uppercase footer_logo">
        {{ $t('footer.title') }}
      </h3>
      <p class="copy-rights mb-5">
        <small> © {{ new Date().getFullYear() }} {{ $t('footer.copyrights') }}</small>
      </p>
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-center  text-sm">
        <span v-for="option, optionIndex in $t('footer.navOptions')" :key="optionIndex" class=" font-bold px-2 cursor-pointer text-decoration-underline" @click="$router.push(option.path)">
          {{ option.title }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script>
import ColorsMixin from '../mixins/ColorsMixin'

export default {
  mixins: [ColorsMixin]
}
</script>
