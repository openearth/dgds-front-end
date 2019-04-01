import Vue from 'vue'
import isArray from 'lodash/isArray'
import getFromApi from '../../lib/request/get'

export const state = () => ({
  dataSets: {},
  activeDataSetIds: [],
  styleId: 'dark',
})

export const mutations = {
  setActiveDataSetIds(state, ids) {
    state.activeDataSetIds = ids
  },
  clearActiveDataSetIds(state) {
    state.activeDataSetIds = []
  },
  addDataSet(state, { id, data }) {
    Vue.set(state.dataSets, id, data)
  },
}

export const actions = {
  loadDataSetsById({ commit }, _ids) {
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    commit('setActiveDataSetIds', ids)

    ids.forEach(id =>
      getFromApi(`geojson/${id}`).then(data =>
        commit('addDataSet', { id, data }),
      ),
    )
  },
}

export const getters = {
  activeDataSets(state) {
    const { activeDataSetIds, dataSets } = state
    const activeDataSets = activeDataSetIds
      .map(id => dataSets[id])
      .filter(value => value)
    return activeDataSets
  },
}
