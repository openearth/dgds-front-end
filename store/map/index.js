import isArray from 'lodash/isArray'
import identity from 'lodash/fp/identity'
import filter from 'lodash/fp/filter'
import get from 'lodash/fp/get'
import has from 'lodash/fp/has'
import map from 'lodash/fp/map'
import set from 'lodash/fp/set'
import head from 'lodash/fp/head'
import merge from 'lodash/fp/merge'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import values from 'lodash/fp/values'
import negate from 'lodash/fp/negate'
import flatten from 'lodash/fp/flatten'
import update from 'lodash/fp/update'
import uniq from 'lodash/fp/uniq'
import omit from 'lodash/fp/omit'
import isEmpty from 'lodash/fp/isEmpty'
import moment from 'moment'
import getFromApi from '../../lib/request/get'
import loadLocations from '../../lib/load-locations'
import {
  includesIn,
  momentFormat,
  getIn,
  wrapInProperty,
  when,
  applyTo,
} from '../../lib/utils'

const notEmpty = negate(isEmpty)
const getId = get('id')

export const state = () => ({
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
}

export const actions = {
  loadThemes({ commit: _commit }) {
    const commit = path => value => _commit(path, value)
    const addTheme = commit('themes/addTheme')
    const addMetadata = commit('datasets/addMetadata')
    const addRaster = commit('datasets/addDatasetSpatial')
    // prettier-ignore
    const storeMetadata =
      pipe([
        get('datasets'),
        omit('wmsUrl'),
        map(addMetadata)
      ])

    // prettier-ignore
    const storeTheme =
      pipe([
        update('datasets', map(get('id'))),
        addTheme,
      ])

    const storeSpatial = pipe([
      get('datasets'),
      filter(get('wmsUrl')),
      map(addRaster),
    ])

    const processTheme = applyTo([storeTheme, storeMetadata, storeSpatial])

    return getFromApi('datasets')
      .then(values)
      .then(map(processTheme))
  },

  async loadLocationsInDatasets({ commit, state, getters }, _ids) {
    const datasets = state.datasets
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    const emptyDatasets = ids.filter(id => !has('locations', datasets[id]))

    commit('setActiveDatasetIds', ids)

    const handleResponse = id => features => {
      const data = Object.freeze({ type: 'FeatureCollection', features })
      commit('datasets/addDatasetLocations', { id, data })
    }

    const promises = emptyDatasets.map(datasetId =>
      loadLocations({ datasetId }, handleResponse(datasetId)),
    )

    await Promise.all(promises)
  },

  loadPointDataForLocation({ commit }, { datasetIds, locationId }) {
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

    // prettier-ignore
    datasets.forEach(datasetId => {
      const parameters = {
        locationCode: locationId,
        startTime: moment()
          .subtract(3, 'days')
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: moment()
          .add(5, 'days')
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        datasetId: datasetId,
      }

      return getFromApi('timeseries', parameters).then(({ results }) => {
        commit(
          'datasets/addDatasetPointData',
          Object.freeze({
            id: datasetId,
            data: {
              [locationId]: {
                category: getFormattedTimeStamps(results),
                serie: getValues(results),
              },
            },
          }),
        )
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

  activeTimestamp(state, { activeSpatialData }) {
    if (activeSpatialData.length) {
      const str = activeSpatialData[0]
      const timestamp = str.split(/time=([^&]+)/)[1]
      const timeDec = decodeURIComponent(timestamp)
      const timemoment = momentFormat('MM-DD-YYYY HH:mm', timeDec)
      return timestamp ? timemoment : ''
    } else {
      return ''
    }
  },
  activeSpatialData({ activeLocationIds }, { activeDatasets }) {
    const spatialLayers = activeDatasets.filter(has('metadata'))
    const tiles = [get('spatial.tiles', head(spatialLayers))]
    return tiles.filter(identity)
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
  activePointDataPerDataset(state) {
    const { activeLocationIds, activeDatasetIds, datasets } = state
    const setNameFromMetadata = id =>
      set('datasetName', get(`${id}.metadata.name`, datasets))

    const getPointDataForLocation = locationId => datasetId =>
      pipe([
        get(`${datasetId}.pointData[${locationId}]`),
        when(notEmpty, setNameFromMetadata(datasetId), identity),
        when(notEmpty, wrapInProperty(datasetId), () => undefined),
        reduce(merge, {}),
        when(notEmpty, identity, () => undefined),
      ])(datasets)

    // prettier-ignore
    const getDataForLocation = locationId =>
      pipe([
        map(getPointDataForLocation(locationId)),
        filter(identity),
        wrapInProperty(locationId),
      ])(activeDatasetIds)

    return activeLocationIds.reduce(
      (acc, locationId) => merge(acc, getDataForLocation(locationId)),
      {},
    )
  },
  datasetsInActiveTheme(state) {
    return values(state.datasets)
      .map(get('metadata'))
      .map(obj => merge(obj, { visible: getId(obj) }))
      .map(update('visible', includesIn(state.activeDatasetIds)))
  },
}
