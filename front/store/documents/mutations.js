import Vue from 'vue'
import { forEach } from 'lodash'

export default {
  SET_DOCUMENTS: (state, { results }) => {
    forEach(results, (x, i) => Vue.set(state, i, x))
  }
}
