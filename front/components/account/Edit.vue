<template>
  <div class="AccountEdit container" :class="getTextColor">
    <header class="container mb-8 my-lg-16">
      <h1 class="text-32 font-weight-light mb-4">
        {{ $t('account.edit.title') }}
      </h1>
      <h2 class="text-24 font-weight-light mb-0">
        {{ $t('account.edit.subtitle') }}
      </h2>
    </header>
    <div v-if="getCurrentUser" :class="getBorderColor" class="row p-4 mb-16">
      <div v-for="col, colIndex in $t('account.edit.data')" :key="colIndex" class="col-12 col-lg-6">
        <AccountNotificationsItem v-for="item, itemIndex in col" :key="itemIndex" :content="item" :is-editing="isEditing">
          <div slot="model">
            <div v-if="isEditing && item.update">
              <v-text-field
                v-for="label, labelIndex in item.update"
                :key="labelIndex"
                v-model="getUserClone[label]"
                :color="getColors[getClassColor]"
                class="mb-0"
              />
            </div>
            <div v-else>
              <span v-if="item.model === 'createdAt'">{{ $moment(item.createdAt).format('DD/MM/YYYY') }}</span>
              <div v-else-if="item.model === 'sizeSpaceUsed'">
                <v-progress-linear
                  :color="getColors[getClassColor]"
                  height="10px"
                  :value="getSpaceValue"
                  striped
                />
                <small class="d-flex align-items-center">
                  <span>{{ getUserClone.sizeSpaceUsed }} / </span>
                  <span>{{ getUserClone.sizeSpace }} MO</span>
                </small>
              </div>
              <span v-else>{{ getUserClone[item.model] }}</span>
            </div>
          </div>
        </AccountNotificationsItem>
      </div>
      <div class="d-flex flex-column flex-md-row w-100 align-items-center justify-content-center">
        <CommonsButton :content="{...$t('account.edit.buttons.updateProfile'), bgColor: getClassColor, title: isEditing? $t('general.save') : $t('account.edit.buttons.updateProfile.title')}" class="mr-2 my-2" @click.native="updateProfile" />
        <CommonsButton :content="{...$t('account.edit.buttons.deleteProfile'), bgColor: 'white', textColor: getTextColor}" class="mr-2 my-2" @click.native="showDeleteModal" />
      </div>
    </div>
    <modal class="z-index-full" name="delete-account-modal" height="auto" :adaptive="true" :scrollable="true">
      <AccountModalDelete />
    </modal>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import ColorsMixin from '../../mixins/ColorsMixin'
import UserMixin from '../../mixins/UserMixin'

export default {
  mixins: [ColorsMixin, UserMixin],
  data () {
    return {
      isEditing: false
    }
  },
  computed: {
    getSpaceValue () {
      if (!this.getCurrentUser) {
        return 0
      }
      return this.getCurrentUser.sizeSpace / 100 * this.getCurrentUser.sizeSpaceUsed
    },
    getUserClone () {
      if (!this.getCurrentUser) {
        return {}
      }
      const userClone = cloneDeep(this.getCurrentUser)
      return { ...userClone, getFullName: userClone.firstname + ' ' + userClone.lastname }
    }
  },
  methods: {
    showDeleteModal () {
      this.$modal.show('delete-account-modal')
    },
    updateProfile () {
      this.isLoading = true
      if (this.isEditing) {
        this.$api.auth.updateAccount(this.getCurrentUser.type, this.getUserClone)
          .finally(() => { this.isLoading = false })
      }
      this.isEditing = !this.isEditing
    }
  }
}
</script>
