export default {
  SAVE_USER: ({ commit }, user) => {
    if (user) {
      localStorage.setItem('type', user.type)
    }
    commit('SET_USER', user)
  }
}
