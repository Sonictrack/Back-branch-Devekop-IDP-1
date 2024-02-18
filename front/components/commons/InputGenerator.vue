<template>
  <div class="InputGenerator">
    <p v-if="content" class="text-primary text-16">
      {{ content.question.title }}
    </p>
    <v-text-field
      v-if="content.question.type === 'text'"
      v-model="value"
      :label="content.question.title"
      :color="getColors.primary"
      :rules="[() => !!content.form[question.model] || 'Obligatoire']"
      required
    />
    <v-radio-group
      v-if="content.question.type === 'radio'"
      v-model="value"
      class="d-flex align-items-center"
    >
      <v-radio
        v-for="n, nIndex in content.question.options"
        :key="nIndex"
        :color="getColors.primary"
        :value="n.value"
      >
        <template #label>
          <p class="ml-2 m-0">
            {{ n.text }}
          </p>
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import ColorsMixin from '../../mixins/ColorsMixin'

export default {
  mixins: [ColorsMixin],
  props: {
    content: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      value: undefined
    }
  }
}
</script>
