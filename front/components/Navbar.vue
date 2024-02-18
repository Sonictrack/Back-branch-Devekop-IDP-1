<template>
  <div class="position-fixed w-100 z-index-full mx-auto p-3" :class="getBackgroundMode.navClass" style="box-shadow: 0 4px 4px 0 #00000040">
    <div class="row">
      <div class="col-12 col-md-2 d-flex flex-row align-items-center justify-content-between">
        <img class="cursor-pointer" :src="getBackgroundMode.logo" alt="IDProtect" height="38" @click="$router.push('/')">
        <solid-menu-alt-3-icon width="32px" height="32px" class="d-flex d-md-none cursor-pointer" @click.native="openMenu = !openMenu" />
      </div>
      <div class="col-md-10 d-none d-md-flex align-items-center justify-content-end">
        <p v-for="option, optionIndex in $t(`menu.${isLoggedIn ? 'navLoggedIn' : 'navOptions'}`)"
           v-if="option.title !== 'Mes documents' || getCurrentUser.type === 'individual'"
           :key="optionIndex"
           :class="option.highlight ? `bg-orangeButton py-1 px-2 rounded text-white` : getBackgroundMode.navClass"
           class="font-weight-bold mx-3 mb-0 text-xs cursor-pointer text-15"
           @click="menuHandler(option, optionIndex)">
          {{ option.title }}
        </p>
      </div>
      <div v-if="openMenu" class="d-md-none d-flex flex-column align-items-center justify-content-center d-md-none position-absolute top-0 left-0 z-index-full bg-white w-100 mobile-h-screen" style="top: 0px; left: 0px;">
        <solid-plus-icon width="56px" height="56px" class="text-primary cursor-pointer rotate135 position-absolute mr-2" style="top: 16px; right: 16px" @click.native="openMenu = false" />
        <p v-for="option, optionIndex in $t(`menu.${isLoggedIn ? 'navLoggedIn' : 'navOptions'}`)"
           v-if="option.title !== 'Mes documents' || getCurrentUser.type === 'individual'"
           :key="optionIndex"
           :class="`py-1 px-2 rounded text-primary`" 
           class="font-weight-bold m-4 mb-0 text-xs cursor-pointer text-15"
           @click="menuHandler(option, optionIndex)">
          {{ option.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ColorsMixin from '../mixins/ColorsMixin'
import UserMixin from '../mixins/UserMixin'
import LogoBlue from '@/assets/images/logos/logo-blue.png'
import LogoWhite from '@/assets/images/logos/logo-white.png' 
import LogoMail from '@/assets/images/logos/logo_mail.png'

export default {
  mixins: [ColorsMixin, UserMixin],
  data () {
    return {
      LogoBlue,
      LogoWhite,
      LogoMail,
      openMenu: false
    }
  },
  computed: {
    getBackgroundMode () {
      const mode = {
        navClass: undefined,
        logo: undefined
      }
      const path = this.$route.path
      if (path === '/') {
        mode.navClass = 'bg-white text-primary'
        mode.logo = LogoBlue
      } else if (path.includes('/professionnels')) {
        mode.navClass = 'bg-secondary text-white'
        mode.logo = LogoWhite
      } else {
        mode.navClass = 'bg-primary text-white'
        mode.logo = LogoWhite
      }
      return mode
    }
  },
  methods: {
    async menuHandler (option, optionIndex, closeMenu) {
      if (closeMenu) {
        this.openMenu = !this.openMenu
      }
      if (option.path.includes('http')) {
        window.open(option.path, '_blank')
        return
      }
      if (option.path === 'actionLogout') {
        await this.$api.auth.logout()
        this.$router.push('/')
      } else {
        let url = option.path
        if (option.path.includes('type')) {
          // account dynamic path
          url = this.$t(`menu.navLoggedIn.${optionIndex}.path`, { type: this.$t(`general.${this.getCurrentUser.type}`) })
        }
        this.$router.push(url)
      }
    }
  }
}
</script>

<style>
  .rotate135 {
    -webkit-transform: rotate(135deg);
    -moz-transform: rotate(135deg);
    -o-transform: rotate(135deg);
    -ms-transform: rotate(135deg);
    transform: rotate(135deg);
  }
</style>
