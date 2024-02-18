<template>
  <div class="AccountHeader pb-16 overflow-hidden" :class="[getBackgroundStyle, { 'border-bottom border-secondary' : isCurrentUserPro }, { 'pt-16': isCurrentUserPro }]">
    <div class="container row mx-auto d-flex align-items-center px-0 py-lg-0 py-16" :class="{'h-screen' : !isCurrentUserPro}">
      <div :class="!isCurrentUserPro ? 'col-12 col-lg-6' : 'col-12 text-center py-lg-16'">
        <div v-if="getCurrentUser">
          <h1 class="text-56 font-weight-bold mb-4" style="color: white">
            {{ $t('account.header.title', { name: getCurrentUser.firstname }) }}
          </h1>
          <p class="text-24 font-weight-light text-white" style="color: white">
            {{ $t('account.header.description') }}
          </p>
          <div v-if="!isCurrentUserPro">
            <p class="font-weight-light" style="color: white">
              {{ $t('account.header.subtitle') }}
            </p>
            <div
              class="text-16 d-flex align-items-center mt-6 cursor-pointer" 
              @click="$scrollTo('#Demandes', 1, { offset: -200 })"
            >
              <solid-arrow-circle-down-icon width="30px" height="30px" class="mr-2" />
              <span>{{ $t('general.requests') }}</span>
            </div>
            <div class="p-1" style="margin-top: 35px;">
              <h3 class="raleway fw-400">
                Il vous reste
              </h3>
              <p style="color: white">
                {{ this.getCurrentUser.credits }} crédits vérification
              </p>
            </div>
          </div>
        </div>
        <div v-else class="d-flex w-100 align-items-center justify-content-center">
          <CommonsLoader size="36" />
        </div>
        <router-link to="/particuliers/controler-document" class="btn btn-white ">
                  CONTRÔLER UN DOCUMENT
        </router-link>
      </div>
      <div v-if="!isCurrentUserPro" class="col-12 col-lg-6 d-flex justify-content-center">
        <CommonsLoader v-if="isLoading" size="36" />
        <AccountNotifications v-else />
      </div>
    </div>
  </div>
</template>

<script>
import ColorsMixin from '../../mixins/ColorsMixin'
import UserMixin from '../../mixins/UserMixin'

export default {
  mixins: [ColorsMixin, UserMixin],
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    getBackgroundStyle () {
      if (this.isCurrentUserPro) {
        return 'bg-white text-secondary'
      }
      return 'bg-primary text-white'
    }
  },
  mounted () {
    this.getNotifications(this.getCurrentUser.type)
  },
  methods: {
    async getNotifications (type) { 
      this.isLoading = true
      await this.$api.notifications.getNotifcations(type)
      this.isLoading = false
    }
  }
}
</script>
