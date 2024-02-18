import Vue from 'vue'

export default {
  SET_USER: (state, payload) => {
    Vue.set(state, 'user', payload)
  }
}
