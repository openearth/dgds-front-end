export const state = () => ({
  active: 'dark',
  available: ['light', 'dark'],
})

export const mutations = () => ({
  setActive(state, theme) {
    state.active = theme
  },
})
