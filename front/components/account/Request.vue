<template>
  <div class="AccountRequest my-16">
    <header class="container text-primary">
      <h1 class="text-32 font-weight-light mb-4">
        {{ $t('account.request.title') }}
      </h1>
      <p class="text-20 font-weight-light">
        {{ $t('account.request.description') }}
      </p>
    </header>
    <div class="py-4 bg-primary text-white">
      <div class="container ">
        <p class="text-20 mb-0 font-weight-regular">
          Vos déclarations de perte
        </p>
      </div>
    </div>
    <div class=" container d-flex flex-sm-row flex-column">
      <CommonsButton class="my-2 mr-md-2 px-auto" :content="$t('account.request.buttons.perte')" />
    </div>
    <div class="container d-flex justify-content-center align-items-center text-primary mb-16">
      <CommonsLoader v-if="isLoading" size="36" :color="getColors.primary" />
      <div v-else-if="!getDocumentsArray.length" class="pt-8">
        <p class="text-primary">
          {{ $t('account.request.none') }}
        </p>
      </div>
      <div v-else class="w-100">
        <v-data-table
          :headers="headers"
          :items="getDocumentsArray"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #[`item.createdAt`]="{ item }">
            {{ $moment(item.createdAt).format('DD/MM/YYYY à HH:mm') }}
          </template>
          <template #[`item.documentIdPath`]="{ item }">
            <div v-if="item.documentIdPath" class="font-weight-bold text-primary cursor-pointer" @click="downloadDocument({...item, name: hideRealFilename(item.documentIdPath)}, 'documentIdPath')">
              <solid-document-text-icon width="32px" height="32px" />
              <span>{{ $t('general.download') }}</span>
            </div>
          </template>
          <template #[`item.pvPath`]="{ item }">
            <div v-if="item.pvPath" class="font-weight-bold text-primary cursor-pointer" @click="downloadDocument({...item, name: hideRealFilename(item.pvPath)}, 'pvPath')">
              <solid-document-download-icon width="32px" height="32px" />
              <span>{{ $t('general.download') }}</span>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
    <div class="py-4 bg-primary text-white">
      <div class="container ">
        <p class="text-20 mb-0 font-weight-regular">
          Vos demandes de renouvellement
        </p>
      </div>
    </div>
    <div class=" container d-flex flex-sm-row flex-column">
      <CommonsButton class="my-2 px-auto" :content="$t('account.request.buttons.renew')" />
    </div>
    <div class="container d-flex justify-content-center align-items-center text-primary mb-16">
      <CommonsLoader v-if="isLoading" size="36" :color="getColors.primary" />
      <div v-else-if="!getRenewDocumentsArray.length" class="pt-8">
        <p class="text-primary">
          {{ $t('account.request.none') }}
        </p>
      </div>
      <div v-else class="w-100">
        <v-data-table
          :headers="headersRenew"
          :items="getRenewDocumentsArray"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #[`item.info`]="{ item }">
            <v-chip
              v-if="item.info"
              dense
              small
              border="left"
              type="warning"
              :color="getColors.orangeButton"
              class="text-white"
            >
              {{ item.info }}
            </v-chip>
          </template>
          <template #[`item.createdAt`]="{ item }">
            {{ $moment(item.createdAt).format('DD/MM/YYYY à HH:mm') }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip small class="text-white" :color="getColors[getStatusColor(item.status)]">
              {{ $t(`status.${item.status}`) }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import UserMixin from '@/mixins/UserMixin'
import MessagesMixin from '../../mixins/MessagesMixin'

export default {
  mixins: [ColorsMixin, ErrorMixin, UserMixin, MessagesMixin],
  data () {
    return {
      headers: [{
        text: this.$t('general.date'),
        sortable: true,
        value: 'createdAt'
      },
      {
        text: this.$t('general.number'),
        sortable: true,
        value: 'numero'
      }, {
        text: this.$t('general.type'),
        sortable: true,
        value: 'reason'
      }, {
        text: this.$t('general.document'),
        sortable: true,
        value: 'documentIdPath'
      }, {
        text: this.$t('general.pv'),
        sortable: true,
        value: 'pvPath'
      }
      ],
      headersRenew: [{
        text: this.$t('general.date'),
        sortable: true,
        value: 'createdAt'
      },
      {
        text: this.$t('general.status'),
        sortable: true,
        value: 'status'
      }, {
        text: this.$t('general.type'),
        sortable: true,
        value: 'reason'
      }, {
        text: this.$t('general.document'),
        sortable: true,
        value: 'type'
      }, {
        text: this.$t('general.info'),
        sortable: true,
        value: 'info'
      }
      ],
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      getDocuments: 'documents/getDocuments',
      getRenewDocuments: 'renew/getRenewDocuments'
    }),
    getDocumentsArray () {
      return Object.values(this.getDocuments)
    },
    getRenewDocumentsArray () {
      return Object.values(this.getRenewDocuments)
    }
  },
  mounted () {
    this.getLostDocuments()
    this.fetchRenewDocuments()
  },
  methods: {
    displayDocument (filepath, filename) {
      this.getDocument(filepath, filename, this.makeToast)
    },
    async getLostDocuments () {
      this.isLoading = true
      await this.$api.documents.getLostDocuments(this.getCurrentUser.type)
      this.isLoading = false
    },
    async fetchRenewDocuments () {
      this.isLoading = true
      await this.$api.documents.getRenewDocuments(this.getCurrentUser.type)
      this.isLoading = false
    }
  }
}
</script>
