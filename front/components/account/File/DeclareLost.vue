<template>
  <div class="DeclareLost w-100">
    <div class="container-fluid d-flex align-items-stretch p-0">
      <div class="row">
        <div class="col-12 col-lg-4">
          <AccountFileUploadZone
            :content="{
              origin: 'id',
              text: 'Cliquez ici pour votre carte d\'identité'
            }"
            @newUpload="checkStatus" 
          />
        </div>
        <div class="col-12 col-lg-4">
          <AccountFileUploadZone
            :content="{
              origin: 'pv',
              text: 'Cliquez ici pour votre procès verbal'
              
            }"
            @newUpload="checkStatus" 
          />
        </div>
        <div class="col-12 col-lg-4">
          <AccountFileCheck @newNumber="checkStatus" />
        </div>
      </div>
    </div>
    <div class="my-4 d-flex justify-content-center">
      <CommonsButton :content="{ title: 'Suivant', bgColor: 'primary', textColor: 'text-white', disabled: !isDisabled }" @click.native="nextStep" />
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import UserMixin from '@/mixins/UserMixin'
import constants from '@/constants'

export default {
  mixins: [ColorsMixin, ErrorMixin, UserMixin],
  data () {
    return {
      docType: undefined,
      isLoading: false,
      id: undefined,
      pv: undefined,
      idNumber: undefined,
      limit: undefined
    }
  },
  computed: {
    isDisabled () {
      return this.id && this.pv && this.idNumber && this.limit && this.checkValue(this.idNumber, this.docType)
    }
  },
  methods: {
    checkStatus (e) {
      if (e.origin) {
        switch (e.origin) {
          case 'id':
            this.id = e.value
            break
          case 'pv':
            this.pv = e.value
            break
          case 'idNumber':
            this.docType = e.docType
            this.idNumber = e.idNumber
            this.limit = e.limit
            break
          case 'residencePermit':
            this.id = "sejour"
            this.docType = e.docType
            break  
          default:
            break
        }
      }
    },
    nextStep () {
      this.isLoading = true
      this.$api.documents.checkDocument(this.getCurrentUser.type, this.docType, this.idNumber)
        .then((response) => {
          const form = {
            reason: constants.DECLARATION_PERTE,
            docType: this.docType,
            id: this.id,
            pv: this.pv,
            idNumber: this.idNumber
          }
          this.$emit('success', {
            form
          })
        }
        )
        .catch(({ response }) => {
          this.$toast.error(response.data.error).goAway(10000)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
