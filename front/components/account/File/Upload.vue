<template>
  <div class="AccountFileUpload my-4">
    <header class="container text-primary mb-4 p-0">
      <h1 class="text-24 font-weight-light">
        {{ $t('account.folder.upload.title', { name: folder.name }) }}
      </h1>
    </header>
    <CommonsLoader v-if="isLoading" size="36" :color="getColors.primary" />
    <v-file-input
      v-else
      v-model="files"
      accept="image/jpeg, image/png, application/pdf"
      :color="getColors.primary"
      counter
      :label="$t('account.folder.upload.file')"
      multiple
      :placeholder="$t('account.folder.upload.file')"
      prepend-icon="mdi-paperclip"
      outlined
      :show-size="1000"
    >
      <template #selection="{ index, text }">
        <v-chip
          v-if="index < 2"
          :color="getColors.primary"
          dark
          label
          small
        >
          {{ text }}
        </v-chip>

        <span
          v-else-if="index === 2"
          class="overline grey--text text--darken-3 mx-2"
        >
          +{{ files.length - 2 }} File(s)
        </span>
      </template>
    </v-file-input>
    <!-- <div class="Visibility">
      <p class="text-16 font-weight-light mb-0">
        {{ $t('account.folder.upload.visibility.title') }}
      </p>
      <div class="d-flex align-items-center">
        <v-checkbox v-for="check, checkIndex in $t('account.folder.upload.visibility.options')" :key="checkIndex" :label="check.title" />
      </div>
    </div> -->
    <div class="d-flex align-items-center justify-content-center">
      <CommonsButton v-for="btn, btnIndex in $t('account.folder.upload.buttons')" :key="btnIndex" :content="{...btn, loading: isLoading, disabled: isDisabled }" class="mr-2" @click.native="handlerUpload(btn)" />
    </div>
  </div>
</template>

<script>
import ColorsMixin from '../../../mixins/ColorsMixin'
import UserMixin from '../../../mixins/UserMixin'

export default {
  mixins: [ColorsMixin, UserMixin],
  props: {
    folder: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      files: [],
      isDisabled: false,
      isLoading: false
    }
  },
  computed: {
  isFileSizeExceeded() {
    return this.files.some(file => this.getFileSizeInMB(file) > 2);
  },
},
watch: {
  isFileSizeExceeded() {
    this.isDisabled = this.isFileSizeExceeded;
  }
},
  methods: {
    async handlerUpload (btn) {
      if (!this.files.length) {
        return
      }
      if (btn.action === 'cancel') {
        this.$emit('close')
      }
      if (btn.action === 'sendDocument') {
        this.isLoading = true
        await this.$api.folders.updateFolder(this.getCurrentUser.type, this.folder, this.files)
          .then((res) => {
            this.$toast.success(this.$t('success.uploadFile')).goAway(10000)
            this.files = []
            this.$emit('close')
          })
          .catch(({ response }) => {
            this.$toast.error(this.$t(`errors.upload.${response.status}`)).goAway(10000)
          })
          .finally(() => { this.isLoading = false })
      }
    }
  }
}
</script>
