<template>
  <div class="Composition">
    <div class="d-lg-flex align-items-center text-left-lg" :class="content.textColor">
      <div v-if="content.image" class="mb-4 mb-lg-0 mr-lg-12">
        <img :src="require(`assets/images/icons/${content.image}.png`)" :alt="content.alt" width="100px">
      </div>
      <component :is="content.icon" v-if="content.icon" width="20px" height="20px" :color="getColors[content.iconColor] || ''" />
      <div>
        <div class="mb-2">
          <div :class="bigger? 'text-32' : 'text-24'" class="d-flex flex-column">
            <span v-if="content.title" class="font-weight-bolder line-height-1">
              {{ content.title }}
            </span>
            <span v-if="content.subtitle" class="font-weight-light">
              {{ content.subtitle }}
            </span>
          </div>
        </div>
        <p v-if="content.description" class="font-weight-light mb-4" :class="bigger? 'text-24' : 'text-15'" v-html="content.description" />
        <CommonsButton v-if="content.button" :content="content.button" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    smaller: {
      default: false,
      type: Boolean
    },
    bigger: {
      default: false,
      type: Boolean
    },
    content: {
      default: () => {},
      type: Object
    },
    reverse: {
      default: false,
      type: Boolean
    }
  }
}
</script>
