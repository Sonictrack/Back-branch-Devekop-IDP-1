<template>
  <div class="AccountModalDelete m-4 text-red">
    <header class="container mb-4">
      <h1 class="text-32 font-weight-light mb-4">
        {{ $t('account.edit.buttons.deleteProfile.modal.title') }}
      </h1>
      <p class="font-weight-light" v-html="$t('account.edit.buttons.deleteProfile.modal.description')" />
      <p class="font-weight-bold mb-1">
        {{ $t('account.edit.buttons.deleteProfile.modal.sentence') }}
      </p>
      <v-text-field
        v-model="sentence"
        :placeholder="$t('account.edit.buttons.deleteProfile.modal.sentence')"
        color="#ff0000"
      />
      <div class="d-flex align-items-center justify-content-center mt-4">
        <CommonsButton :content="{title: $t('account.edit.buttons.deleteProfile.title'), disabled: isDisabled, loading: isLoading }" class="mr-2" @click.native="deleteAccount" />
        <CommonsButton :content="{title: $t('general.cancel'), loading: isLoading}" class="mr-2" @click.native="$modal.hide('delete-account-modal')" />
      </div>
    </header>
  </div>
</template>

<script>
import UserMixin from '../../../mixins/UserMixin'

export default {
  mixins: [UserMixin],
  data () {
    return {
      isDisabled: true,
      isLoading: false,
      sentence: undefined
    }
  },
  watch: {
    sentence: {
      handler (n) {
        if (n) {
          this.isDisabled = !(this.$t('account.edit.buttons.deleteProfile.modal.sentence') === this.sentence)
        }
      }
    }
  },
  methods: {
    deleteAccount () {
      this.isLoading = true
      this.$api.auth.deleteAccount(this.getCurrentUser.type)
        .catch(() => {
          this.$toast.error(this.$t('errors.common')).goAway(10000)
        })
        .finally(() => {
          this.$modal.hide('delete-account-modal')
          this.isLoading = false
        })
    }
  }
}
</script>
