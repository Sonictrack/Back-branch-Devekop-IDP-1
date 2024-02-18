<template>
  <div class="Card d-flex flex-column justify-content-between text-center d-flex flex-column border border-primary cursor-pointer" style="min-height: 350px;" @click="openCard">
    <div class="flex-grow-1 p-4" :class="[content.bgColor, content.textColor]">
      <h5 class="font-weight-bold mb-4" v-html="content.title" />
      <p class="text-left" v-html="content.description" />
    </div>
    <h2 class="font-weight-bold my-3">
      {{ content.price }}
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      default: () => {},
      type: Object
    }
  },
  methods: {
    openCard () {
      if (this.content.path) {
        this.$router.push(this.content.path)
      }
    }
  }
}
</script>
