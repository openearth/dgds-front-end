export const state = () => ([])

export const mutations = {
  addTheme (state, theme) {
    state.push(theme)
  }
}

export const getters = {
  getThemes (state) {
    return state
  }
}

export default {
  state,
  mutations,
  getters
}
