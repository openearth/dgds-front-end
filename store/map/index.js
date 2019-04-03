import Vue from 'vue'
import isArray from 'lodash/isArray'
import identity from 'lodash/fp/identity'
import filter from 'lodash/fp/filter'
import includes from 'lodash/fp/includes'
import get from 'lodash/fp/get'
import has from 'lodash/fp/has'
import map from 'lodash/fp/map'
import head from 'lodash/fp/head'
import merge from 'lodash/fp/merge'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import flatten from 'lodash/fp/flatten'
import uniq from 'lodash/fp/uniq'
import negate from 'lodash/negate'
import getFromApi from '../../lib/request/get'
import {
  includesIn,
  momentFormat,
  getIn,
  wrapInProperty,
  when,
} from '../../lib/utils'

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
  loadLocationsInDataSets({ commit, state, getters }, _ids) {
    const { knownDataSetIds } = getters
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    const knownIds = ids.filter(includesIn(knownDataSetIds))
    const unknownIds = ids.filter(negate(includesIn(knownDataSetIds)))

    unknownIds.forEach(id => console.warn(`Data set ${id} is not known.`))

    commit('setActiveDataSetIds', knownIds)

    // prettier-ignore
    knownIds.forEach(id => {
      const parameters = {
        datasetId: id,
      }
      return getFromApi('locations', parameters)
        .then(({ results: features }) => {
          const data = { type: 'FeatureCollection', features }
          commit('addDataSetLocations', { id, data })
        })
    })
  },

  loadPointDataForLocation({ commit, getters }, { dataSetIds, locationId }) {
    const { knownLocationIds, knownDataSetIds } = getters

    // prettier-ignore
    const getEvents = pipe([
      filter(has('events')),
      map(get('events')),
      head,
    ])

    // prettier-ignore
    const getFormattedTimeStamps = pipe([
      getEvents,
      map(get('timeStamp')),
      map(momentFormat('MM-DD-YYYY \n HH:mm')),
    ])

    // prettier-ignore
    const getValues = pipe([
      getEvents,
      map(get('value')),
    ])

    // prettier-ignore
    const dataSets = isArray(dataSetIds)
      ? dataSetIds
      : dataSetIds.split(',')

    console.log({ knownLocationIds, locationId })
    includes(locationId, knownLocationIds)
      ? commit('setActiveLocationIds', [locationId])
      : console.warn(`LocationId ${locationId} is not known.`)

    // prettier-ignore
    dataSets.filter(includesIn(knownDataSetIds)).forEach(dataSetId => {
      const parameters = {
        locationCode: locationId,
        startTime: '2019-03-22T00:00:00Z',
        endTime: '2019-03-26T00:50:00Z',
        datasetId: dataSetId,
      }

      return getFromApi('timeseries', parameters).then(({ results }) => {
        commit('addDataSetPointData', {
          id: dataSetId,
          data: {
            [locationId]: {
              title: `${locationId}`,
              category: getFormattedTimeStamps(results),
              serie: getValues(results),
            },
          },
        })
      })
    })
  },
}

export const getters = {
  knownDataSetIds(state) {
    return Object.keys(state.dataSets)
  },
  knownLocationIds(state) {
    const getInDataSets = getIn(state.dataSets)
    const getLocationId = map(get('properties.locationId'))
    const featuresInDataSets = id => getInDataSets(`${id}.locations.features`)
    const getKnownLocationIds = pipe([
      Object.keys,
      filter(featuresInDataSets),
      map(pipe([featuresInDataSets, getLocationId])),
      flatten,
      uniq,
    ])

    return getKnownLocationIds(state.dataSets)
  },

  activeDataSets(state) {
    const { activeDataSetIds, dataSets } = state
    const getInDataSets = getIn(dataSets)

    // prettier-ignore
    return activeDataSetIds
      .map(getInDataSets)
      .filter(identity)
  },
  activeDataSetsLocations({ activeLocationIds }, { activeDataSets }) {
    const getActiveProperty = feature =>
      pipe([
        get('properties.locationId'),
        includesIn(activeLocationIds),
        active => ({ active }),
      ])(feature)

    // prettier-ignore
    const addActiveProperty = feature =>
      pipe([
        get('properties'),
        merge(getActiveProperty(feature)),
        wrapInProperty('properties'),
        merge(feature),
      ])(feature)

    // prettier-ignore
    const enhanceFeatureWithActiveState = location =>
      pipe([
        get('features'),
        map(addActiveProperty),
        wrapInProperty('features'),
        merge(location)
      ])(location)

    return activeDataSets
      .map(get('locations'))
      .filter(identity)
      .map(enhanceFeatureWithActiveState)
  },
  activePointDataPerDataSet(state) {
    const { activeLocationIds, activeDataSetIds, dataSets } = state
    const getPointDataForLocation = locationId => dataSetId =>
      pipe([
        get(`${dataSetId}.pointData[${locationId}]`),
        when(wrapInProperty(dataSetId), () => undefined),
        filter(identity),
        reduce(merge, {}),
      ])(dataSets)

    // prettier-ignore
    const getDataForLocation = locationId =>
      pipe([
        map(getPointDataForLocation(locationId)),
        wrapInProperty(locationId),
      ])(activeDataSetIds)

    return activeLocationIds.reduce(
      (acc, locationId) => merge(acc, getDataForLocation(locationId)),
      {},
    )
  },
}
