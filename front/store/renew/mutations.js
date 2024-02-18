import Vue from 'vue'
import { forEach } from 'lodash'
import constants from '@/constants'

export default {
  SET_RENEW_DOCUMENTS: (state, { results }) => {
    forEach(results, (x) => {
      const newDocument = {
        ...x,
        reason: constants.RENOUVELLEMENT
      }
      Vue.set(state, newDocument.id, newDocument)
    })
  }
}
