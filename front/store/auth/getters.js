export default {
  isLoggedIn: (state) => {
    return !!state.user
  },
  getCurrentUser: (state) => {
    return state.user
  }
}
