<template>
  <v-progress-circular
    :size="size"
    :color="getClassColor"
    indeterminate
  />
</template>

<script>
import ColorsMixin from '../../mixins/ColorsMixin'
export default {
  mixins: [ColorsMixin],
  props: {
    color: {
      default: 'white',
      type: String
    },
    size: {
      default: '',
      type: String
    }
  }
}
</script>
