export const state = () => ({
  sidebarAnimating: false,
  sidebarExpanded: false
})

export const mutations = {
  setSidebarAnimating (state, { animating }) {
    state.sidebarAnimating = animating
  },
  setSidebarExpanded (state, { expanded }) {
    state.sidebarExpanded = expanded
  }
}
