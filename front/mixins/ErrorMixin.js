import constants from '@/constants'

const ErrorMixin = {
  data () {
    return {
      constants,
      error: undefined,
      success: undefined,
      rulesLogin: {
        mailLogin: { 
          required: v => this.isRequired(v) || this.$t('errors.required'),
          emailMatch: v => this.validateEmail(v) || this.$t('errors.form.mailLogin')
        },
        passwordLogin: { 
          required: v => this.isRequired(v) || this.$t('errors.required'),
          letter: v => this.checkPasswordLetter(v) || this.$t('errors.form.letter'),
          number: v => this.checkPasswordNumber(v) || this.$t('errors.form.number'),
          min: v => this.checkPassword(v) || this.$t('errors.form.passwordLogin')
        }
      },
      rulesRegister: {
        firstName: {
          required: v => this.isRequired(v) || this.$t('errors.required'),
          stringMatch: v => this.checkString(v) || this.$t('errors.form.errorFirstName'),
          checkLength: v => this.checkLength(v) || this.$t('errors.form.errorLength')
        },
        lastName: {
          required: v => this.isRequired(v) || this.$t('errors.required'),
          stringMatch: v => this.checkString(v) || this.$t('errors.form.errorLastName'),
          checkLength: v => this.checkLength(v) || this.$t('errors.form.errorLength')
        },
        mail: {
          required: v => this.isRequired(v) || this.$t('errors.required'),
          emailMatch: v => this.validateEmail(v) || this.$t('errors.form.mail')
        },
        password: {
          required: v => this.isRequired(v) || this.$t('errors.required'),
          letter: v => this.checkPasswordLetter(v) || this.$t('errors.form.letter'),
          number: v => this.checkPasswordNumber(v) || this.$t('errors.form.number'),
          min: v => this.checkPassword(v) || this.$t('errors.form.password')
        },
        passwordConfirm: {
          required: v => this.isRequired(v) || this.$t('errors.required'),
          emailMatch: v => v === this.form.password || this.$t('errors.form.passwordConfirm')
        },
        phone: {
          required: v => this.isRequired(v) || this.$t('errors.required'),
          emailMatch: v => this.validatePhoneNumber(v) || this.$t('errors.form.phone')
        },
        companyName: {
          required: v => this.isRequired(v) || this.$t('errors.required'),
          stringMatch: v => this.checkString(v) || this.$t('errors.form.errorCompanyName'),
          checkLength: v => this.checkLength(v) || this.$t('errors.form.errorLength')
        }
      },
      rules: { 
        password: {
          required: v => this.isRequired(v),
          letter: v => this.checkPasswordLetter(v) || this.$t('errors.form.letter'),
          number: v => this.checkPasswordNumber(v) || this.$t('errors.form.number'),
          min: v => this.checkPassword(v) || this.$t('errors.form.password')
        },
        passwordConfirm: {
          required: v => this.isRequired(v),
          emailMatch: v => v === this.form.password || this.$t('errors.form.passwordConfirm')
        }
      }
    }
  },
  computed: {
    isPro () {
      return this.$route.path.includes('/professionnels') ? 'partner' : 'individual'
    }
  },
  methods: {
    validatePhoneNumber(phone){
      // Regular expression for a valid phone number in France
      const phoneNumberPattern = /^((\+)33|0)[1-9](\d{2}){4}$/;
      // Check if the phone number matches the pattern
      if (!phoneNumberPattern.test(phone)){
        return false;
      } else{
        return true;
      }
    },
    checkPasswordLetter (password) {
      if (!password) { return false }
      const re = /[a-zA-Z]/g
      return re.test(password)
    },
    checkPasswordNumber (password) {
      if (!password) { return false }
      const re = /\d/
      return re.test(password)
    },
    checkPassword (password) {
      if (!password) { return false }
      return password.length >= 8
    },
    checkValue (value, type) {
      if(type && type=="permis"){
        if (value && value.length >= 6 && value.length <= 12) {
          return true
        }else{
          return false
        }
      }else{
        if (value && value.length >= 9 && value.length < 13) {
          return true
        }else{
          return false
        }
      } 
    },
    dispatchError (origin, code) {
      if (!origin && !code) {
        return this.showError(this.$t('errors.common'))
      }
      return this.showError(this.$t(`errors.${origin}.${code.toString()}`))
    },
    isRequired (v) { 
      if (v === undefined || (v && v.trim().length==0)) { 
        return false
      }else{
        return true
      } 
    }, 
    checkString(text){
      if (!text) { return false }
      var regex = /^[a-zA-Zàâäéèêëîïôöùûüÿç-]+$/;
      //const re =  /^[a-zA-Z]+(([ ][a-zA-Z ])?[a-zA-Z]*)*$/;  /*/^[A-Za-z ]+$/ */ 
      return regex.test(text)
    }, 
    checkLength(text){
      if (text && text.trim().length<1) { return false } 
      return true;
    },
    showError (msg) {
      this.error = msg
      // setTimeout(() => { this.error = undefined }, 6000)
    },
    showSuccess (msg) {
      this.success = msg
    },
    sendNotification (type, action, to, detail) {
      const notification = {
        action,
        to,
        detail
      }
      this.$api.notifications.sendNotification(type, notification)
        .catch(({ response }) => {
          this.$toast.error(response.data.error).goAway(10000)
        })
    },
    toastError (origin, code) {
      this.$toast.error(this.$t(`errors.${origin}.${code.toString()}`)).goAway(10000)
    },
    validateEmail (email) {
      if (!email) { return false }
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  }
}

export default ErrorMixin
