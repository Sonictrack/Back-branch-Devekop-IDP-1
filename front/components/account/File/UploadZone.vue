<template>
  <div class="UploadZone h-100 d-flex align-items-center justify-content-center cursor-pointer" :class="[getBorderColor, getTextColor]">
    <div class="text-center px-2">
      <v-file-input
        :ref="'file' + content.origin"
        v-model="value"
        small-chips
        accept="image/jpeg, image/png, application/pdf"
        :color="getColors.primary"
        :placeholder="content.text"
        prepend-icon=""

        class="d-flex align-items-center flex-column flex-column-reverse cursor-pointer"
      >
        <solid-document-add-icon slot="append-outer" class="text-primary mb-2" width="100px" height="100px" @click.native="openInput" />
      </v-file-input>
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
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
  },
  watch: {
    value: {
      handler () {
        this.$emit('newUpload', {
          value: this.value,
          origin: this.content.origin
        })
      }
    }
  }, 
  methods: {
    openInput () {
      if (!this.content) {
        return
      }
      this.$refs['file' + this.content.origin].$el.querySelector('input').click()
    },
    // handleFileChange () {
    //   const fileSizeInMB = this.getFileSizeInMB(this.value);

    //   if (fileSizeInMB > 2) {
    //     this.$toast.error("Veuillez sélectionner un fichier de moins de 2 Mo").goAway(8000);
    //     this.value = undefined; // Clear the selected file
    //   }
    // },
    // getFileSizeInMB(file) {
    //   if (!file) {
    //     return 0;
    //   }
    //   const fileSizeInBytes = file.size;
    //   const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    //   return fileSizeInMB.toFixed(2); // Round to 2 decimal places
    // }
  }
}
</script>
