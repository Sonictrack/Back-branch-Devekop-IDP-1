<template>
  <div class="Login container mb-32" @keyup.enter="handler">
    <div class="row justify-content-center my-5">
      <div class="col-12 col-lg-6 order-1 order-lg-0">
        <div :class="getBorderColor">
          <v-tabs v-model="activeTab">
            <v-tab v-for="option, optionIndex in options" :key="optionIndex" :class="activeTab === optionIndex ? getBackgroundColor : 'bg-white'">
              {{ $t(option.name)}}  
            </v-tab>
          </v-tabs>
          <v-tabs-items v-if="!forgotten" v-model="activeTab" class="p-3 p-lg-6">
            <v-text-field 
              v-for="label in options[activeTab].contains"
              :key="label"
              v-model="form[label]" 
              :type="label === 'passwordLogin' || label === 'password' || label === 'passwordConfirm' ? 'password' : 'text'"
              :color="getColorType"
              :label="$t(`login.form.${label}`)"
              :rules="getRules(label)"
              required
            /> 
            <p v-if="!forgotten && activeTab === 0" class="inline-block text-12 my-4 cursor-pointer text-decoration-underline" :class="getTextColor" @click="forgotten = !forgotten">
              {{ $t('login.form.forgotten') }}
            </p>
            <Error v-if="activeTab != 1" :text="error" />
            <CommonsButton
              width="100%"
              :content="{ bgColor: getClassColor, disabled: !isValid, loading: isLoading, textColor: 'text-white', title: $t(options[activeTab].button), fullWidth: true }"
              @click.native="handler"
            />
          </v-tabs-items> 
          <Forgotten v-else :pro="pro" @close="forgotten = !forgotten" />
        </div>
      </div>
      <div class="col-12 col-lg-6 order-0 order-lg-0 p-sm-2 p-lg-5" :class="getTextColor">
        <h1 class="font-weight-bold pb-5 display-5">
          {{ $t('login.info.title', { type: isPro === 'partner'? 'professionnels' : 'particuliers' }) }}
        </h1>
        <div class="text-20">
          <p class="font-weight-light">
            {{ $t('login.info.subtitle') }}
          </p>
          <p class="font-weight-light mb-0">
            {{ $t('login.info.notMember') }}
          </p>
          <p v-html="$t('login.info.subscribe')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { forEach } from 'lodash'
import ColorsMixin from '../mixins/ColorsMixin'
import ErrorMixin from '../mixins/ErrorMixin'

export default {
  mixins: [ColorsMixin, ErrorMixin],
  props: {
    hasOrigin: {
      default: '',
      type: String
    },
    pro: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      activeTab: 0,
      forgotten: false,
      form: {
        firstName: undefined,
        lastName: undefined,
        password: undefined,
        passwordConfirm: undefined,
        phone: undefined,
        mail: undefined, 
        mailLogin: undefined ,
        passwordLogin: undefined,
        companyName: undefined    
      }, 
      isLoading: false,
      options:[ 
        {
          button: 'login.buttons.login',
          name: 'login.tabs.login',
          contains: ['mailLogin', 'passwordLogin']
        },
        {
          button: 'login.buttons.signin',
          name: 'login.tabs.signin',
          contains: this.$route.path.includes('/professionnels')?['firstName', 'lastName', 'mail', 'password', 'passwordConfirm', 'phone', 'companyName']:['firstName', 'lastName', 'mail', 'password', 'passwordConfirm', 'phone']
        }
      ]
    } 
  },
  computed: {
    isLogin () {
      return this.activeTab === 0
    },
    isValid () { 
      if (this.isLogin) {
        if (this.validateEmail(this.form.mailLogin) && this.checkPassword(this.form.passwordLogin) ) {
          return true
        }
      }else{
        if(this.isPro=="individual"){
          if (this.checkLength(this.form.firstName) && this.checkLength(this.form.lastName) && this.validateEmail(this.form.mail) && this.checkPassword(this.form.password) && this.form.password === this.form.passwordConfirm && this.checkPasswordLetter(this.form.password) && this.checkPasswordNumber(this.form.password) && this.validatePhoneNumber(this.form.phone)) {
          return true
        }
        }else{
          if (this.checkLength(this.form.companyName) && this.checkLength(this.form.firstName) && this.checkLength(this.form.lastName) && this.validateEmail(this.form.mail) && this.checkPassword(this.form.password) && this.form.password === this.form.passwordConfirm && this.checkPasswordLetter(this.form.password) && this.checkPasswordNumber(this.form.password) && this.validatePhoneNumber(this.form.phone)) {
          return true
        }
        }
        
      } 
      return false
    }
  },
  methods: {
    getRules(label){    
      const rules = []
      if(this.activeTab===0){ 
        forEach(this.rulesLogin[label], x => rules.push(x)) 
      }
      if(this.activeTab===1){ 
        forEach(this.rulesRegister[label], x => rules.push(x))
      }   
      return rules;
    },  
    handler () {
      this.error = undefined
      let redirectTo
      if (this.$route.path.includes('login')) {
        redirectTo = true
      }
      if (this.isLogin) {
        this.isLoading = true
        this.$api.auth.login(this.form.mailLogin, this.form.passwordLogin, this.isPro, redirectTo)
          .then((user) => {
            if (!this.$nuxt.$route.path.includes('perte-ou-vol')) {
              this.$router.push(`${user.type === 'partner' ? '/professionnels' : '/particuliers'}/espace-client`)
            }
          })
          .catch((err) => {  
            if (err && err.response.status) {
              this.dispatchError('login', err.response.status)
            } else {
              this.$toast.error(this.$t('errors.common')).goAway(10000)
            }
          })
          .finally(() => { this.isLoading = false })
      } else {
        this.isLoading = true
        this.$api.user.register({
          email: this.form.mail,
          firstname: this.form.firstName,
          lastname: this.form.lastName,
          password: this.form.password,
          phoneNumber: this.form.phone,
          type: this.isPro, 
          companyName: this.form.companyName
        })
          .then(({ success }) => {
            if (!this.hasOrigin) {
              this.$router.push('/')
            } else {
              this.$emit('success')
            }
            this.$toast.success(success).goAway(10000)
          })
          .catch(({ response }) => {
            this.$toast.error(response.data.error).goAway(10000)
          })
          .finally(() => { this.isLoading = false })
      }
    }
  }
}
</script>
