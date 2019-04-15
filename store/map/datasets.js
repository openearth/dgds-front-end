import Vue from 'vue'

export const state = () => ({
  wl: {},
  wd: {},
})

export const mutations = {
  addDatasetLocations(state, { id, data }) {
    Vue.set(state[id], 'locations', data)
  },
  addDatasetPointData(state, { id, data }) {
    Vue.set(state[id], 'pointData', data)
  },
}
