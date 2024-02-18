import Vue from 'vue'
import { forEach } from 'lodash'

export default {
  SET_FOLDERS: (state, folders) => {
    forEach(folders, (x, i) => Vue.set(state, i, x))
  }
}
