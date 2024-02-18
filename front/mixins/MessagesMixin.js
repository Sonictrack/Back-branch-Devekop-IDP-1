export default {
  methods: {
    makeToast (title = '', content = '', variant = 'danger') {
      this.$bvToast.toast(content, {
        title,
        toaster: 'b-toaster-top-center',
        autoHideDelay: 3000,
        variant,
        solid: true
      })
    }
  }
}
