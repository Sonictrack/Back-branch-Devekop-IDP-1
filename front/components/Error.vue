<template>
  <p class="text-red">
    {{ text }}
  </p>
</template>

<script>
export default {
  props: {
    text: {
      default: '',
      type: String
    }
  }
}
</script>
