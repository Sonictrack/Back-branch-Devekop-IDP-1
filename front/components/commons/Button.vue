<template>
  <v-btn
    :disabled="content.disabled"
    :width="content.fullWidth ? '100%' : 'auto'"
    :color="content.bgColor ? getColors[content.bgColor] : ''"
    :loading="content.loading"
    elevation="0"
    @click="handler(content.path)"
  >
    <component
      :is="content.icon"
      v-if="content.icon"
      width="20px"
      height="20px"
      :color="getColors[content.iconColor] || ''"
    />
    <span :class="content.textColor" class="font-weight-bold">
      {{ content.title }}
    </span>
  </v-btn>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'

export default {
  mixins: [ColorsMixin],
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handler (path) {
      if (!path) { return }
      if (path === 'scrollTo') {
        this.$scrollTo(this.content.scrollTo, 1, { offset: -50 })
        return
      }
      if (path === 'openModal') {
        this.$modal.show(this.content.modalName)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>
