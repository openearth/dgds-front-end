export const state = () => ({
  sidebarAnimating: false,
  sidebarExpanded: false,
  user: null,
})

export const mutations = {
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
