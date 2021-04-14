import getColors from '../../lib/styling/colors'

export const state = () => ({
  active: 'dark'
})

export const mutations = {
  setActive (state, theme) {
    state.active = theme
    this.$setCustomProperties(theme)
  }
}

export const getters = {
  colors (state) {
    return getColors(state.active)
  }
}

export default {
  state: () => state,
  mutations
}
