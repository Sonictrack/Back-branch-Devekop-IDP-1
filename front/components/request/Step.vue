<template>
  <div class="Step text-center d-flex flex-column">
    <div class="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle mx-auto mb-3 min-w-16 min-h-16">
      <div class="p-3">
        <h2 v-if="content.number" class="font-weight-bold">
          {{ content.number }}
        </h2>
        <component :is="content.icon" v-if="content.icon" width="50px" height="50px" :color="content.iconColor" />
      </div>
    </div>
    <h5 v-if="content.title" class="font-weight-bold" style="min-height: 60px;">
      {{ content.title }}
    </h5>
    <p v-if="content.description" class="text-14" style="min-height: 60px;">
      {{ content.description }}
    </p>
    <div v-if="content.button">
      <CommonsButton :content="content.button" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      default: () => {},
      type: Object
    }
  }
}
</script>
