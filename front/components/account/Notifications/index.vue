<!-- <style>
.main {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0px;
}

.Notifications {
  /* border: 3px solid white; */
  width: 75%;
  height: 100vh;

}
.scrollable {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #888888 #F5F5F5;
}

.scrollable::-webkit-scrollbar {
  width: 8px;
}

.scrollable::-webkit-scrollbar-track {
  background: #F5F5F5;
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: #888888;
  border-radius: 4px;
}

@media screen and (max-width: 992px) {
  .scrollable {
    overflow-y: scroll;
  }
}
</style> -->



<template>
  <div class="main">
    <p v-if="getContent.title" class="text-24 text-white text-center font-weight-bold pb-12">
      {{ getContent.title }}
    </p>
    <div class="Notifications text-white text-left">
      <div class="scrollable">
        <div v-if="getFilteredNotifications.length">
          <AccountNotificationsItem v-for="notif, notifIndex in getFilteredNotifications" :key="notifIndex" :content="notif" />
          <div v-if="getNotificationsArray.length > 4" class="d-flex">
            <p class="text">{{ range }}-{{ term }} sur {{ getNotificationsArray.length }}</p>
            <solid-arrow-left-icon class="cursor-pointer mx-2" width="24px" height="24px" @click.native="openRange(false)" />
            <solid-arrow-right-icon class="cursor-pointer mx-2" width="24px" height="24px" @click.native="openRange(true)" />
          </div>
        </div>
        <p v-else class="text">
          {{ $t('account.header.notifications.none') }}
        </p>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      range: 0,
      term: 5
    }
  },
  mounted () {
    // console.log(Object.values(this.getNotifications));
  },
  // created() {
  //   this.fetchNotifications()
  // },
  computed: {
    ...mapGetters({
      getNotifications: 'notifications/getNotifications'
    }),
    getNotificationsArray () {
      return Object.values(this.getNotifications)
    },
    getFilteredNotifications () {
      return this.getNotificationsArray.slice(this.range, this.term)
    },
    getContent () {
      return this.$t('account.header.notifications')
    }
  },
  methods: {
    openRange (boolean) {
      if (boolean) {
        if (this.term >= this.getNotificationsArray.length) {
          return
        }
        this.range = this.range + 5
        this.term = this.term + 5
      } else {
        if (this.range === 0) {
          return
        }
        this.range = this.range - 5
        this.term = this.term - 5
      }
    },
    // fetchNotifications() {
    //   // Les notifications sont déjà récupérées via les computed
    //   // Pas besoin d'appeler l'API ici
    // },
  }
}
</script>
