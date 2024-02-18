<template>
  <div class="Password container py-24">
    <div class="bg-white rounded-lg px-4 text-center">
      <div class="text-primary">
        <h1 class="font-weight-bold">
          {{ $t('password.title') }}
        </h1>
        <p class="mb-4" v-html="$t('password.description')" />
      </div>
      <div class="mx-auto mb-4" style="max-width: 300px;">
        <v-text-field
          v-for="item, itemIndex in form"
          :key="itemIndex"
          v-model="form[itemIndex]"
          type="password"
          :color="getColorType"
          :label="$t(`login.form.${itemIndex}`)"
          :rules="getRules(itemIndex)"
        />
      </div>
      <CommonsButton
        :content="{...$t('password.button'), loading: isLoading, disabled: !isValid }"
        @click.native="sendNewPasswords"
      />
    </div>
  </div>
</template>

<script>
import { forEach } from 'lodash'
import ColorMixins from '../../mixins/ColorsMixin'
import ErrorMixin from '../../mixins/ErrorMixin'

export default {
  mixins: [ColorMixins, ErrorMixin],
  props: {
    pro: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      isLoading: false,
      form: {
        password: undefined,
        passwordConfirm: undefined
      }
    }
  },
  computed: {
    isValid () {
      if (this.checkPassword(this.form.password) && this.form.password === this.form.passwordConfirm && this.checkPasswordLetter(this.form.password) && this.checkPasswordNumber(this.form.password)) {
        return true
      }
      return false
    }
  },
  methods: {
    getRules (item) {
      const rules = []
      forEach(this.rules[item], x => rules.push(x))
      return rules
    },
    sendNewPasswords () {
      const token = this.$route.query.p
      if (!token) { return null }
      this.isLoading = true
      this.$api.user.resetPassword(token, this.form.password)
        .then(({ success }) => {
          this.$router.push('/')
          this.$toast.success(success).goAway(10000)
        })
        .catch((err) => {
          this.$toast.error(err.response.data.error).goAway(10000)
        })
        .finally(() => { this.isLoading = false })
    }
  }
}
</script>
