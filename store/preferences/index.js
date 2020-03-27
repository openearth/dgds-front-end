export const state = () => ({
  sidebarExpanded: false
})

export const mutations = {
  setSidebarExpanded (state, { expanded }) {
    state.sidebarExpanded = expanded
  }
}
