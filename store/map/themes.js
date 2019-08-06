import Vue from 'vue'

export const state = () => ({})

export const mutations = {
  addTheme(state, theme) {
    console.log('theme', theme)
    Vue.set(state, theme.id, theme)
  },
}
