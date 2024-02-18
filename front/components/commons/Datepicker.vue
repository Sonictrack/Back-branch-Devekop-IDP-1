<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    persistent
    width="290px"
    :close-on-content-click="true"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="content.title"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="date"
      scrollable
      locale="fr-fr"
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="modal = false"
      >
        Annuler
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="$refs.dialog.save(date)"
      >
        Valider
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  props: {
    content: {
      default: () => {},
      type: Object
    }
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    modal: false
  }),
  computed: {
    computedDateFormattedMomentjs () {
      return this.date
    }
  },
  watch: {
    date: {
      immediate: true,
      handler () {
        this.$emit('onDate', {
          date: this.date,
          model: this.content.model
        })
      }
    }
  }
}
</script>
