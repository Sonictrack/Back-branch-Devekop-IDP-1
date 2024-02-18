import Vue from 'vue'
import { forEach } from 'lodash'

export default {
  SET_NOTIFICATIONS: (state, { notifications }) => {
    forEach(notifications, (x, i) => Vue.set(state, i, x))
  }
}
