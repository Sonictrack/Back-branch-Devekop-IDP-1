<template>
  <div class="root">
    <Navbar />
    <transition name="slide" mode="out-in">
      <nuxt class="main-content" />
    </transition>
  </div>
</template>

<script>
import Navbar from "~/components/commons/navbar/Navbar";

export default {
  name: "default.vue",
  components: { Navbar }
};
</script>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
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

.slide-enter-active {
  animation: slide-in 300ms ease-out forwards;
}

.slide-leave-active {
  animation: slide-out 300ms ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>
