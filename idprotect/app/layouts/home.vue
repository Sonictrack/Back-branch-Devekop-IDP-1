<template>
  <div class="root">
    <div class="scroll">
      <Navbar :transparent="true"/>
      <nuxt class="main-content"/>
    </div>
  </div>
</template>

<script>
  import Navbar from '~/components/commons/navbar/Navbar.vue'

  export default {
    name: "home.vue",
    components: { Navbar },
  }
</script>

<style lang="scss">
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  .root {
    height: 100vh;
    width: 100vw;
    overflow-y: scroll;
  }

  .scroll {
    height: 100%;
    width: 100%;
  }

  .main-content {
    margin: auto;
    padding: 5rem 1.5rem calc(5rem - #{$navbar-height});

    @include media-breakpoint-up(lg) {
      height: 100%;
      min-height: 40rem;
      padding-top: $navbar-height;
      padding-bottom: 0;
    }
  }

  .toast-failure {
    background-color: #dc3545;
  }

</style>
