import Vue from 'vue'
import moment from 'moment'
import isArray from 'lodash/isArray'
import identity from 'lodash/fp/identity'
import get from 'lodash/fp/get'
import negate from 'lodash/negate'
import getFromApi from '../../lib/request/get'
import { includesIn } from '../../lib/utils'

export const state = () => ({
  dataSets: {
    wl: {},
    wd: {},
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
  addDataSetPointData(state, { id, data }) {
    Vue.set(state.dataSets[id], 'pointData', data)
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
  loadPointDataForLocation({ commit, state }, { dataSetIds, locationId }) {
    const dataSets = isArray(dataSetIds) ? dataSetIds : dataSetIds.split(',')
    commit('setActiveLocationIds', [locationId])

    dataSets.forEach(dataSetId =>
      getFromApi('timeseries').then(res => {
        const events = res.results.filter(x => x.events)
        const category = events[0].events.map(event => {
          return moment(event.timeStamp).format('MM-DD-YYYY \n HH:mm')
        })
        commit('addDataSetPointData', {
          id: dataSetId,
          data: {
            [locationId]: {
              title: `${locationId}`,
              category: category,
              serie: events[0].events.map(event => event.value),
            },
          },
        })
      }),
    )
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
    const { activeLocationIds } = state
    return activeDataSets
      .map(get('locations'))
      .filter(identity)
      .map(locations => {
        const features = locations.features.map(feature => {
          const id = feature.properties.locationId
          const active = includesIn(activeLocationIds, id)
          const properties = { ...feature.properties }
          if (active) {
            properties.active = active
          }
          return { ...feature, properties }
        })
        return { ...locations, features }
      })
  },
  activePointDataPerDataSet(state) {
    const { activeLocationIds, activeDataSetIds, dataSets } = state

    return activeLocationIds.reduce((acc, locationId) => {
      acc[locationId] = activeDataSetIds
        .map(dataSetId => {
          const data = get(`${dataSetId}.pointData[${locationId}]`, dataSets)
          const obj = { [dataSetId]: data }
          return data ? obj : undefined
        })
        .filter(identity)
        .reduce((obj, item) => ({ ...obj, ...item }), [])
      return acc
    }, {})
  },
}
