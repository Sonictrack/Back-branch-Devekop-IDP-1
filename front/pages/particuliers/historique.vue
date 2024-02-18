<template>
  <div
    class="AccountHeader pb-16 overflow-hidden"
    :class="[
      getBackgroundStyle,
      { 'border-bottom border-secondary': isCurrentUserPro },
      { 'pt-16': isCurrentUserPro },
    ]"
  >
    <div
      class="container row mx-auto d-flex align-items-center px-0 py-lg-0 py-16"
      :class="{ 'h-screen': !isCurrentUserPro }"
    >
      <div>
        <!-- <div v-if="getCurrentUser"> -->
        <!-- <h1 class="text-56 font-weight-bold mb-4" style="color: white">
              {{ $t('account.header.title', { name: getCurrentUser.firstname }) }}
            </h1> -->
        <!-- <p class="text-24 font-weight-light text-white" style="color: white">
              {{ $t('account.header.description') }}
            </p> -->
        <!-- <div v-if="!isCurrentUserPro">
              <p class="font-weight-light" style="color: white">
                {{ $t('account.header.subtitle') }}
              </p> -->
        <!-- <div
                class="text-16 d-flex align-items-center mt-6 cursor-pointer" 
                @click="$scrollTo('#Demandes', 1, { offset: -200 })"
              >
                <solid-arrow-circle-down-icon width="30px" height="30px" class="mr-2" />
                <span>{{ $t('general.requests') }}</span>
              </div> -->
        <!-- <div class="p-1" style="margin-top: 35px;">
                <h3 class="raleway fw-400">
                  Il vous reste
                </h3>
                <p style="color: white">
                  {{ this.getCurrentUser.credits }} crédits vérification
                </p>
              </div> -->
        <!-- </div>
          </div> -->
        <!-- <div v-else class="d-flex w-100 align-items-center justify-content-center">
            <CommonsLoader size="36" />
          </div> -->
        <!-- <router-link to="/particuliers/controler-document" class="btn btn-white ">
                    CONTRÔLER UN DOCUMENT
          </router-link>
        </div> -->
      </div>
      <div v-if="!isCurrentUserPro" class="">
        <div class="">
          <CommonsLoader v-if="isLoading" size="36" />
          <AccountNotifications v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorsMixin from "../../mixins/ColorsMixin";
import UserMixin from "../../mixins/UserMixin";
import AuthService from "../../api/auth";

export default {
  middleware: "auth",
  mixins: [ColorsMixin, UserMixin],
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    getBackgroundStyle() {
      if (this.isCurrentUserPro) {
        return "bg-white text-secondary";
      }
      return "bg-primary text-white";
    },
  },
  async mounted() {
    try {
      const authService = new AuthService(this);
      await authService.authStateChange();

      const type = localStorage.getItem("type");
      if (type) {
        await authService.getUser(type);
        const user = this.getCurrentUser;
        if (user && user.type) {
          // Vérifier si user et user.type sont définis
        //   console.log(user.type);
          this.getNotifications(user.type);
        } else {
          console.error("Le type de l'utilisateur n'est pas défini.");
        }
      } else {
        console.error(
          'La clé "type" n\'est pas présente dans le localStorage.'
        );
      }
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    async getNotifications(type) {
      this.isLoading = true;
      await this.$api.notifications.getNotifcations(type);
      this.isLoading = false;
    },
  },
};
</script>
