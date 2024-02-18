import Vue from "vue"


export default Vue.mixin({
    methods:{
        makeToast(title = '', content = '', variant = 'danger') {
            this.$bvToast.toast(content, {
              title: title,
              toaster: 'b-toaster-top-center',
              autoHideDelay: 3000,
              variant: variant,
              solid: true
            })
        }
    }
})