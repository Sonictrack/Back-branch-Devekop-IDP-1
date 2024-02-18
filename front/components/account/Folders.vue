<template>
  <div class="AccountFolders my-16">
    <div class="py-4 bg-primary text-white">
      <div class="container ">
        <p class="text-20 mb-0 font-weight-regular">
          Dossier ID PROTECT
        </p>
      </div>
    </div>
    <v-alert
      :color="getColors.orange"
      type="info"
      elevation="2"
      dismissible
      class="container my-2"
    >
      {{ $t('account.folder.warning') }}
    </v-alert>
    <div class="container d-flex justify-content-center align-items-center text-primary pt-8">
      <CommonsLoader v-if="isLoading" size="36" :color="getColors.primary" />
      <div v-else-if="!getFoldersArray.length">
        <p class="text-primary">
          {{ $t('account.request.folder') }}
        </p>
      </div>
      <div v-else class="w-100">
        <v-tabs v-model="activeTab" fixed-tabs>
          <v-tab v-for="tab, tabIndex in getFoldersArray" :key="tabIndex" :class="activeTab === tabIndex ? getBorderColor + ' text-primary' : 'bg-white'">
            <solid-folder-icon width="32px" height="32px" class="mr-2" />
            {{ tab.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-if="getActiveTabContent" v-model="activeTab" class="pb-5 pt-4">
          <CommonsButton v-for="btn, btnIndex in $t('account.folder.buttons')" :key="btnIndex" :content="btn" class="mr-2 mb-2" @click.native="isUpload = !isUpload" />
          <AccountFileUpload v-if="isUpload" :folder="getActiveTabContent" @close="isUpload = false" />
          <div v-else>
            <div v-if="isTabLoading" class="d-flex justify-content-center">
              <CommonsLoader size="36" :color="getColors.primary" />
            </div>
            <v-data-table
              v-else
              :headers="headers"
              :items="getActiveTabContent.documents"
              :items-per-page="5"
              class="elevation-1"
            >
              <template #[`item.name`]="{ item }">
                <p>{{ hideRealFilename(item.name) }}</p>
              </template>
              <template #[`item.path`]="{ item }">
                <div v-if="item.path" class="d-flex align-items-center">
                  <div class="font-weight-bold text-primary cursor-pointer mr-3" @click="downloadDocument(item)">
                    <solid-document-download-icon width="32px" height="32px" />
                    <span>{{ $t('general.download') }}</span>
                  </div>
                  <div class="font-weight-bold text-red cursor-pointer" @click="deleteDocument(item)">
                    <solid-trash-icon width="32px" height="32px" />
                    <span>{{ $t('general.delete') }}</span>
                  </div>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorsMixin from '../../mixins/ColorsMixin'
import UserMixin from '../../mixins/UserMixin'

export default {
  mixins: [ColorsMixin, UserMixin],
  data () {
    return {
      activeTab: 0,
      headers: [{
        text: this.$t('general.name'),
        sortable: true,
        value: 'name'
      },
      {
        text: 'Options',
        value: 'path'
      }
      ],
      isLoading: true,
      isTabLoading: false,
      isUpload: false
    }
  },
  computed: {
    ...mapGetters({
      getFolders: 'folders/getFolders'
    }),
    getActiveTabContent () {
      if (!this.getFoldersArray) { return '' }
      return this.getFoldersArray[this.activeTab]
    },
    getFoldersArray () {
      if (!this.getFolders) { return [] }
      return Object.values(this.getFolders)
    }
  },
  watch: {
    activeTab: {
      handler () {
        this.isUpload = false
      }
    }
  },
  mounted () {
    this.getCurrentFolders()
  },
  methods: {
    async deleteDocument (item) {
      this.isTabLoading = true
      await this.$api.folders.updateFolder(this.getCurrentUser.type, this.getActiveTabContent, [], [item])
        .then(() => {
          this.$toast.success(this.$t('success.removeFile')).goAway(10000)
        })
        .catch(() => {
          this.$toast.error(this.$t('errors.common')).goAway(10000)
        })
        .finally(() => { this.isTabLoading = false })
    },
    async getCurrentFolders () {
      this.isLoading = true
      await this.$api.folders.getFolders(this.getCurrentUser.type)
      this.isLoading = false
    }
  }
}
</script>
