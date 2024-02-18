<template>
  <div v-if="hideIfNotPro" class="NotificationItem my-3">
    <div class="d-flex">
      <div class="d-flex align-items-center justify-content-center text-primary rounded-circle mb-3 mr-4" style="width: 40px; height: 40px; min-width: 40px; max-height: 40px;" :class="content.iconColor ? getBackgroundColor : 'bg-white'">
        <div v-if="!content.icon">
          <solid-lock-closed-icon v-if="content.action === constants.DECLARATION_PERTE" width="28px" height="28px" />
          <img v-if="content.action === constants.RENOUVELLEMENT" src="@/assets/images/icons/process_icon.png" alt="ID Protect" width="28px" height="28px">
          <img
            v-if="content.action == constants.RECHERCHE_ID"
            src="@/assets/images/icons/search_icon_blue.png"
            alt="ID Protect"
            width="28px"
            height="28px">
          <img
            v-if="content.action == constants.VERROUILLER_UN_DOCUMENT"
            src="@/assets/images/icons/openPadlock.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
          <img
            v-if="content.action == constants.DEVERROUILLER_UN_DOCUMENT"
            src="@/assets/images/icons/closedPadlock.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
          <img
            v-if="content.action == constants.DEMASQUER_UN_DOCUMENT"
            src="@/assets/images/icons/unmask.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
          <img
            v-if="content.action == constants.MASQUER_UN_DOCUMENT"
            src="@/assets/images/icons/mask.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
          <img
            v-if="content.action == constants.DEMANDE_AUTORISATION_ACCEPTE"
            src="@/assets/images/icons/accept.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
          <img
            v-if="content.action == constants.DEMANDE_AUTORISATION_REFUSE"
            src="@/assets/images/icons/refuse.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
          <img 
            v-if="content.action == constants.DEMANDE_AUTORISATION_SANS_REPONSE"
            src="@/assets/images/icons/waiting.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
          <img
            v-if="content.action == constants.ANALYSE"
            src="@/assets/images/icons/analyze.png"
            alt="ID Protect"
            width="28px"
            height="28px" >
        </div>
        <component :is="content.icon" v-if="content.icon" width="20px" height="20px" :color="getColors[content.iconColor]" />
      </div>
      <div>
        <p v-if="content.title" class="font-weight-bold mb-0">
          {{ content.title }}
          <solid-question-mark-circle-icon
            v-if="isEditing && content.modal"
            class="cursor-pointer"
            :color="getColors.orange"
            width="24px"
            height="24px"
            @click.native="$modal.show(`acccount-information-${content.model === 'email' ? 'email' : 'sizeSpaceUsed'}`, { content:content.modal })"
          />
          <modal v-if="content.model === 'email' || content.model === 'sizeSpaceUsed'" height="auto" :adaptative="true" :name="`acccount-information-${content.model === 'email' ? 'email' : 'sizeSpaceUsed'}`">
            <div class="text-white bg-orange">
              <header class="container py-8 bg-white text-orange text-center">
                <h1 class="text-32 font-weight-light mb-0">
                  {{ content.modal.title }}
                </h1>
              </header>
              <div class="p-4">
                <p class="font-weight-light pb-4" v-html="content.modal.description" />
                <CommonsButton :content="content.modal.button" class="mr-2" @click.native="$modal.hide(`acccount-information-${content.model === 'email' ? 'email' : 'sizeSpaceUsed'}`)" />
              </div>
            </div>
          </modal>
        </p>
        <slot name="model" />
        <div v-if="content.action" class="mb-0 font-weight-bold">
          <span v-if="content.action">{{ content.action }}:</span>
          <span v-if="content.detail">{{ formtDetailsNotif(content.detail) }}</span>
        </div>
        <small v-if="content.updatedAt">{{ $moment(content.updatedAt).format('DD/MM/YYYY à HH:mm') }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import ColorsMixin from '@/mixins/ColorsMixin'
import UserMixin from '@/mixins/UserMixin'
import constants from '@/constants'

export default {
  mixins: [ColorsMixin, UserMixin],
  props: {
    content: {
      default: () => {},
      type: Object
    },
    isEditing: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      constants
    }
  },
  computed: {
    hideIfNotPro () {
      if (!this.content && this.content.condition) {
        return
      }
      if (this.content.condition === 'isPro') {
        return this.isCurrentUserPro
      }
      return true
    } 
  },
  methods: {
    formtDetailsNotif(detail){
      //extract document number from notification text
      let docNumber = detail.substring(detail.indexOf('#')+1, detail.lastIndexOf('#')-1);
      //Check the document number in the notification details
      if(docNumber){
        //hide document number
        let asterisks = '*'.repeat(docNumber.length - 1);
        let maskedNumber = asterisks + docNumber.substring(docNumber.length - 1);
        detail = detail.replace(docNumber, maskedNumber)
        return detail.replaceAll('#', '');
      }else{
        return detail;
      }
    }
  }
}
</script>
