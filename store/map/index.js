import Vue from 'vue'
import isArray from 'lodash/isArray'
import identity from 'lodash/fp/identity'
import filter from 'lodash/fp/filter'
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
  datasets: {
    wl: {},
    wd: {},
  },
  activeDatasetIds: [],
  activeLocationIds: [],
})

export const mutations = {
  setActiveDatasetIds(state, ids) {
    state.activeDatasetIds = ids
  },
  clearActiveDatasetIds(state) {
    state.activeDatasetIds = []
  },
  setActiveLocationIds(state, ids) {
    state.activeLocationIds = ids
  },
  clearActiveLocationIds(state) {
    state.activeLocationIds = []
  },
  addDatasetLocations(state, { id, data }) {
    Vue.set(state.datasets[id], 'locations', data)
  },
  addDatasetPointData(state, { id, data }) {
    Vue.set(state.datasets[id], 'pointData', data)
  },
}

export const actions = {
  loadLocationsInDatasets({ commit, state, getters }, _ids) {
    const { knownDatasetIds } = getters
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    const knownIds = ids.filter(includesIn(knownDatasetIds))
    const unknownIds = ids.filter(negate(includesIn(knownDatasetIds)))

    unknownIds.forEach(id => console.warn(`Data set ${id} is not known.`))

    commit('setActiveDatasetIds', knownIds)

    // prettier-ignore
    knownIds.forEach(id => {
      const parameters = {
        datasetId: id,
      }
      return getFromApi('locations', parameters)
        .then(({ results: features }) => {
          const data = { type: 'FeatureCollection', features }
          commit('addDatasetLocations', { id, data })
        })
    })
  },

  loadPointDataForLocation({ commit, getters }, { datasetIds, locationId }) {
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
    const datasets = isArray(datasetIds)
      ? datasetIds
      : datasetIds.split(',')

    commit('setActiveLocationIds', [locationId])

    // prettier-ignore
    datasets
      .forEach(datasetId => {
        const parameters = {
          locationCode: locationId,
          startTime: '2019-03-22T00:00:00Z',
          endTime: '2019-03-26T00:50:00Z',
          datasetId: datasetId,
        }

        return getFromApi('timeseries', parameters)
          .then(({ results }) => {
            commit('addDatasetPointData', {
              id: datasetId,
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
  knownDatasetIds(state) {
    return Object.keys(state.datasets)
  },
  knownLocationIds(state) {
    const getInDatasets = getIn(state.datasets)
    const getLocationId = map(get('properties.locationId'))
    const featuresInDatasets = id => getInDatasets(`${id}.locations.features`)
    const getKnownLocationIds = pipe([
      Object.keys,
      filter(featuresInDatasets),
      map(pipe([featuresInDatasets, getLocationId])),
      flatten,
      uniq,
    ])

    return getKnownLocationIds(state.datasets)
  },

  activeDatasets(state) {
    const { activeDatasetIds, datasets } = state
    const getInDatasets = getIn(datasets)

    // prettier-ignore
    return activeDatasetIds
      .map(getInDatasets)
      .filter(identity)
  },
  activeDatasetsLocations({ activeLocationIds }, { activeDatasets }) {
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

    return activeDatasets
      .map(get('locations'))
      .filter(identity)
      .map(enhanceFeatureWithActiveState)
  },
  activePointDataPerDataSet(state) {
    const { activeLocationIds, activeDataSetIds, dataSets } = state
    const getPointDataForLocation = locationId => dataSetId =>
      pipe([
        get(`${datasetId}.pointData[${locationId}]`),
        when(wrapInProperty(datasetId), () => undefined),
        filter(identity),
        reduce(merge, {}),
      ])(datasets)

    // prettier-ignore
    const getDataForLocation = locationId =>
      pipe([
        map(getPointDataForLocation(locationId)),
        wrapInProperty(locationId),
      ])(activeDatasetIds)

    return activeLocationIds.reduce(
      (acc, locationId) => merge(acc, getDataForLocation(locationId)),
      {},
    )
  },
}
