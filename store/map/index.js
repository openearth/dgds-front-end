import Vue from 'vue'
import isArray from 'lodash/isArray'
import identity from 'lodash/fp/identity'
import get from 'lodash/fp/get'
import negate from 'lodash/negate'
import getFromApi from '../../lib/request/get'
import { includesIn } from '../../lib/utils'

export const state = () => ({
  dataSets: {
    wl: {},
  },
  activeDataSetIds: [],
  activeLocationIds: [],
})

export const mutations = {
  setActiveDataSetIds(state, ids) {
    state.activeDataSetIds = ids
  },
  clearActiveDataSetIds(state) {
    state.activeDataSetIds = []
  },
  setActiveLocationIds(state, ids) {
    state.activeLocationIds = ids
  },
  clearActiveLocationIds(state) {
    state.activeLocationIds = []
  },
  addDataSetLocations(state, { id, data }) {
    Vue.set(state.dataSets[id], 'locations', data)
  },
}

export const actions = {
  loadLocationsInDataSets({ commit, state }, _ids) {
    const knownDataSetIds = Object.keys(state.dataSets)
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    const knownIds = ids.filter(includesIn(knownDataSetIds))
    const unknownIds = ids.filter(negate(includesIn(knownDataSetIds)))

    unknownIds.forEach(id => console.warn(`Data set ${id} is not known.`))

    commit('setActiveDataSetIds', knownIds)

    knownIds.forEach(id =>
      getFromApi('locations').then(({ results: features }) => {
        const data = { type: 'FeatureCollection', features }
        commit('addDataSetLocations', { id, data })
      }),
    )
  },
  loadTimeseriesDataForLocation({ commit }, _ids) {
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    commit('setActiveLocationIds', ids)
  },
}

export const getters = {
  activeDataSets(state) {
    const { activeDataSetIds, dataSets } = state
    const activeDataSets = activeDataSetIds
      .map(id => dataSets[id])
      .filter(identity)
    return activeDataSets
  },
  activeDataSetsLocations(state, { activeDataSets }) {
    return activeDataSets.map(get('locations')).filter(identity)
  },
}
