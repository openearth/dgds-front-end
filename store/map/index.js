import isArray from 'lodash/isArray'
import identity from 'lodash/fp/identity'
import filter from 'lodash/fp/filter'
import get from 'lodash/fp/get'
import has from 'lodash/fp/has'
import map from 'lodash/fp/map'
import merge from 'lodash/fp/merge'
import pipe from 'lodash/fp/pipe'
import values from 'lodash/fp/values'
import flatten from 'lodash/fp/flatten'
import uniq from 'lodash/fp/uniq'
import _ from 'lodash'
import moment from 'moment'
import getFromApi from '../../lib/request/get'
import {
  includesIn,
  momentFormat,
  getIn,
  wrapInProperty,
} from '../../lib/utils'

const getId = get('id')

export const state = () => ({
  activeDatasetIds: [],
  activeLocationIds: [],
  activeRasterLayerId: '',
  activeTheme: {},
  collapsedDatasets: [],
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
  toggleCollapsedDataset(state, id) {
    // Updates the collapsedDatasets array, when id already exists in this Array
    // it will be removed from the array, otherwise it will be added.
    if (state.collapsedDatasets.includes(id)) {
      state.collapsedDatasets = state.collapsedDatasets.filter(
        set => set !== id,
      )
    } else {
      state.collapsedDatasets.push(id)
    }
  },
}

export const actions = {
  loadDatasets({ commit }) {
    return getFromApi('datasets').then(val => {
      // Loop over datasets to get a list of available datasets per theme
      val.themes.map(theme => {
        theme.datasets = _.compact(
          val.datasets.map(set => {
            if (set.themes.includes(theme.id)) {
              return set.id
            }
          }),
        )
        return theme
      })

      // Add themes to store.themes
      val.themes.forEach(theme => commit('themes/addTheme', theme))

      val.datasets.forEach(set => {
        // Add metadata to store.datasets (excluding vectorLayer and rasterLayer)
        commit(
          'datasets/addMetadata',
          _.omit(set, ['vectorLayer', 'rasterLayer']),
        )

        // Add vectorlayer to store.datasets if available
        if (_.has(set, 'vectorLayer')) commit('datasets/addDatasetVector', set)

        // Add rasterLayer to store.datasets if available
        if (
          _.has(set, 'rasterLayer') &&
          _.get(set, 'rasterLayer.url') !== null
        ) {
          commit('datasets/addDatasetRaster', set)

          // If key rasterActiveOnLoad is true, turn this layer on on load
          const rasterActive = _.get(set, 'rasterActiveOnLoad')
          if (rasterActive) {
            commit('setActiveRasterLayer', set.id)
          }
        }
      })
    })
  },

  storeActiveDatasets({ commit, state, getters }, _ids) {
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    commit('setActiveDatasetIds', ids)
  },

  loadPointDataForLocation({ commit, state }, { datasetIds, locationId }) {
    const datasets = isArray(datasetIds) ? datasetIds : datasetIds.split(',')
    datasets.forEach(datasetId => {
      if (_.get(state.datasets[datasetId], 'pointdata[locationId]')) {
        return
      }

      const parameters = {
        locationId: locationId,
        startTime: moment()
          .subtract(3, 'days')
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: moment()
          .add(5, 'days')
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        datasetId: datasetId,
      }
      getFromApi('timeseries', parameters).then(response => {
        const pointDataType = _.get(
          state.datasets[datasetId].metadata,
          'pointData',
        )

        // Depending on the pointDataType different responses are expected.
        // images -> just an url to a svg image
        // line or scatter -> data to create echarts graph
        if (pointDataType === 'images') {
          commit('datasets/addDatasetPointData', {
            id: datasetId,
            data: {
              [locationId]: {
                imageUrl: response,
              },
            },
          })
        } else {
          let category = []
          let serie = []
          const eventResults = response.results.filter(res =>
            _.has(res, 'events'),
          )

          eventResults.forEach(res => {
            serie = serie.concat(res.events.map(event => event.value))
            category = category.concat(
              res.events.map(event => moment(event.timeStamp).format()),
            )
          })

          commit('datasets/addDatasetPointData', {
            id: datasetId,
            data: {
              [locationId]: {
                category: category,
                serie: serie,
              },
            },
          })
        }
      })
    })
  },
}

export const getters = {
  getActiveTheme(state) {
    return state.activeTheme
  },
  getDatasets(state) {
    return state.datasets
  },
  knownDatasetIds(state) {
    return Object.keys(state.datasets)
  },
  getActiveRasterLayer(state, id) {
    return state.activeRasterLayerId
  },
  getCollapsedDatasets(state) {
    return state.collapsedDatasets
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

  activeTimestamp({ activeRasterData }) {
    // Retrieve the timestamp according to the current selected Raster layer
    // TODO: this function still works with the old fews url sources
    if (_.head(activeRasterData)) {
      const str = activeRasterData[0]
      const timestamp = str.split(/time=([^&]+)/)[1]
      const timeDec = decodeURIComponent(timestamp)
      const timemoment = momentFormat('MM-DD-YYYY HH:mm', timeDec)
      return timestamp ? timemoment : ''
    } else {
      return ''
    }
  },
  activeRasterData({ datasets, activeRasterLayerId, activeDatasets }) {
    // Return the active raster data tiles (if not defined, return [])
    if (activeRasterLayerId === '' || activeRasterLayerId === null) return []
    const tiles = get(`${activeRasterLayerId}.raster.tiles`, datasets)
    return [tiles]
  },
  activeRasterLegendData({ datasets, activeRasterLayerId, activeDatasets }) {
    // Return the active raster data tiles (if not defined, return [])
    if (activeRasterLayerId === '' || activeRasterLayerId === null) return []
    const raster = get(`${activeRasterLayerId}.raster`, datasets)
    return {
      linearGradient: raster.linearGradient,
      min: raster.min,
      max: raster.max,
    }
  },
  activeVectorData({ activeLocationIds }, { activeDatasets }) {
    // Retrieve for active layers where vector data is available the data
    const vectorLayers = activeDatasets.filter(has('vector'))
    const mapboxLayers = vectorLayers.map(layer => {
      return get('vector.mapboxLayer', layer)
    })
    return mapboxLayers.filter(identity)
  },
  activeDatasetsLocations({ activeLocationIds }, { activeDatasets }) {
    // Retrieve for the active datasets the locations
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
    const activePointDataPerDataset = {}

    // Get for each active locations the pointData belonging to the available datasets
    activeLocationIds.forEach(locationId => {
      // Filter all datasets where pointdata is available from the available datasets
      const activePointData = activeDatasetIds.filter(datasetId => {
        const apData = _.get(datasets, `${datasetId}.pointData`)
        return _.get(apData, [locationId])
      })

      // Create object with pointdata for each location
      activePointDataPerDataset[locationId] = activePointData.map(datasetId => {
        const data = _.get(datasets, `${datasetId}`)
        const locData = _.get(data.pointData, [locationId])
        locData.datasetName = _.get(data, 'metadata.name')
        locData.units = _.get(data, 'metadata.units')
        locData.type = _.get(data, 'metadata.pointData')
        locData.id = _.get(data, 'metadata.id')
        return locData
      })
    })
    return activePointDataPerDataset
  },
  datasetsInActiveTheme(state) {
    const ids = state.activeDatasetIds
    let sets = values(state.datasets)

    if (state.activeTheme.datasets !== undefined) {
      const themeids = state.activeTheme.datasets
      sets = values(state.datasets).filter(set => {
        return themeids.includes(set.metadata.id)
      })
    }
    const metadataSets = sets.map(set => {
      return _.get(set, 'metadata')
    })
    const visible = metadataSets.map(obj => merge(obj, { visible: getId(obj) }))
    return visible.map(set => {
      set.visible = ids.includes(set.id)
      return set
    })
  },
}
