import { logout as apiLogout } from '../api/user'

export const state = () => ({
  type: (localStorage.getItem('type') || null) as 'partner' | 'individual' | 'admin' | null,
})

function setOrRemoveItemFromLocal (itemName: string, itemValue: string | null): void {

  if (itemValue !== null) {
    localStorage.setItem(itemName, itemValue)
  }
  else {
    localStorage.removeItem(itemName)
  }
}

export const mutations = {
  setLoginType (state, type: string | null): void {
    state.type = type
    setOrRemoveItemFromLocal('type', type)
  },

  clear(state){
    localStorage.removeItem('type')
  }

}

export const actions = {
  userLogin ({ commit }, user): void {
    commit('setLoginType', user.type)
  },

  async logout ({ commit }): Promise<void> {
    commit('setLoginType', null)
    commit('clear')
    await apiLogout()
  },

  async logoutNoAPI ({ commit }): Promise<void> {
    commit('setLoginType', null)
  },  
}