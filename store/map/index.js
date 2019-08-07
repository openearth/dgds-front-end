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
  activeRasterLayerId: '',
  activeTheme: {},
})

export const mutations = {
  setActiveDatasetIds(state, ids) {
    state.activeDatasetIds = ids
  },
  clearActiveDatasetIds(state) {
    state.activeDatasetIds = []
  },
  toggleActiveTheme(state, id) {
    if (state.activeTheme.id === id) {
      state.activeTheme = {}
    } else {
      state.activeTheme = state.themes[id]
    }
  },
  clearActiveTheme(state) {
    state.activeTheme = {}
  },
  setActiveLocationIds(state, ids) {
    state.activeLocationIds = flatten(ids.map(id => id.split(',')))
  },
  clearActiveLocationIds(state) {
    state.activeLocationIds = []
  },
  setActiveRasterLayer(state, id) {
    state.activeRasterLayerId = id
  },
}

export const actions = {
  loadThemes({ commit: _commit }) {
    const commit = path => value => _commit(path, value)
    const addTheme = commit('themes/addTheme')
    const addMetadata = commit('datasets/addMetadata')
    const addRaster = commit('datasets/addDatasetSpatial')
    const addVector = commit('datasets/addDatasetVector')

    // prettier-ignore
    const storeMetadata =
      pipe([
        get('datasets'),
        omit('rasterUrl'),
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
      filter(get('rasterUrl')),
      map(addRaster),
    ])

    const storeVector = pipe([
      get('datasets'),
      filter(get('mapboxLayer')),
      map(addVector),
    ])

    const processTheme = applyTo([
      storeTheme,
      storeMetadata,
      storeSpatial,
      storeVector,
    ])

    return getFromApi('datasets')
      .then(values)
      .then(map(processTheme))
  },

  storeActiveDatasets({ commit, state, getters }, _ids) {
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    commit('setActiveDatasetIds', ids)
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
  getThemes(state) {
    return state.themes
  },
  getActiveTheme(state) {
    return state.activeTheme
  },
  knownDatasetIds(state) {
    return Object.keys(state.datasets)
  },
  getActiveRasterLayer(state, id) {
    return state.activeRasterLayerId
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
    if (
      activeSpatialData &&
      activeSpatialData.length &&
      activeSpatialData[0] !== ''
    ) {
      const str = activeSpatialData[0]
      const timestamp = str.split(/time=([^&]+)/)[1]
      const timeDec = decodeURIComponent(timestamp)
      const timemoment = momentFormat('MM-DD-YYYY HH:mm', timeDec)
      return timestamp ? timemoment : ''
    } else {
      return ''
    }
  },
  activeSpatialData({ datasets, activeRasterLayerId, activeDatasets }) {
    console.log('activeRasterLayerId', activeRasterLayerId)
    if (activeRasterLayerId === '') return []
    const tiles = get(`${activeRasterLayerId}.metadata.rasterUrl`, datasets)
    return [tiles]
  },
  activeVectorData({ activeLocationIds }, { activeDatasets }) {
    const vectorLayers = activeDatasets.filter(has('vector'))
    const mapboxLayers = vectorLayers.map(layer => {
      return get('vector.mapboxLayer', layer)
    })
    return mapboxLayers.filter(identity)
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
    let ids = state.activeDatasetIds
    if (state.activeTheme.datasets !== undefined) {
      ids = state.activeTheme.datasets
    }
    const sets = values(state.datasets)
      .map(get('metadata'))
      .map(obj => merge(obj, { visible: getId(obj) }))
      .map(update('visible', includesIn(ids)))
    return sets
  },
}
