export const getDefaultState = () => ({
  sidebarAnimating: false,
  sidebarExpanded: false,
  user: null,
})

export const state = getDefaultState()

export const mutations = {
  resetPreferences(state) {
    Object.assign(state, getDefaultState())
  },
  setSidebarAnimating(state, { animating }) {
    state.sidebarAnimating = animating
  },
  setSidebarExpanded(state, { expanded }) {
    state.sidebarExpanded = expanded
  },
  setUser(state, { user }) {
    state.user = user
  },
}
