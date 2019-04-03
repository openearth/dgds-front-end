export const state = () => ({
  active: 'light',
  available: ['light', 'dark'],
})

export const mutations = () => ({
  setActive(state, theme) {
    state.active = theme
  },
})
