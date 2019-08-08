import Vue from 'vue'

export const state = () => ({})

export const mutations = {
  addTheme(state, theme) {
    Vue.set(state, theme.id, theme)
  },
}

export const getters = {
  getThemes(state) {
    return state
  },
}
