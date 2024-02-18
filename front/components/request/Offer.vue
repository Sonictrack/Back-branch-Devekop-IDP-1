<template>
  <div class="Offer container py-16 text-left-lg text-primary">
    <h2 class="font-weight-light mb-16" v-html="content.title" />
    <div v-if="content.steps" class="row my-8">
      <div
        v-for="item, itemIndex in content.steps"
        :key="itemIndex"
        class="col-12 mb-4 mb-lg-0"
        :class="`col-md-${getColumnLength}`"
        data-aos="slide-up"
        :data-aos-duration="750 * itemIndex"
      >
        <component :is="content.component" :content="item" />
      </div>
    </div>
    <div v-if="content.button" class="d-flex justify-content-center">
      <CommonsButton :content="content.button" />
    </div>
    <p v-if="content.note" class="small font-italic text-center pt-8" v-html="content.note" />
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
  computed: {
    getColumnLength () {
      switch (this.content.steps.length) {
        case 2:
          return '6'
        case 3:
          return '4'
        case 4:
          return '3'
        default:
          return ''
      }
    }
  }
}
</script>
