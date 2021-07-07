import isArray from 'lodash/isArray'
import flatten from 'lodash/fp/flatten'
import _ from 'lodash'
import moment from 'moment'
import getCatalog from '@/lib/request/get-catalog'
import datasets from './datasets.js'
import themes from './themes.js'
import Vue from 'vue'

// const getId = get('id')

export const getDefaultState = () => ({
  activeDatasetIds: [],
  activeLocationIds: [],
  activeRasterData: {},
  vectorDataCollection: {},
  activeRasterLayerId: 'el',
  activeFlowmapLayer: {},
  activeTheme: '',
  loadingRasterLayers: false,
  geographicalScope: ''
})

export const state = getDefaultState()

export const mutations = {
  resetMap (state) {
    state.activeDatasetIds = []
    state.activeLocationIds = []
    state.activeTheme = ''
    state.loadingRasterLayers = false
  },
  setActiveDatasetIds (state, ids) {
    state.activeDatasetIds = ids
  },
  setGeographicalScope (state, scope) {
    state.geographicalScope = scope
  },
  clearActiveDatasetIds (state) {
    state.activeDatasetIds = []
  },
  toggleActiveTheme (state, id) {
    if (state.activeTheme === id) {
      state.activeTheme = ''
    } else {
      state.activeTheme = id
    }
  },
  clearActiveTheme (state) {
    state.activeTheme = {}
  },
  setActiveLocationIds (state, ids) {
    state.activeLocationIds = flatten(ids.map(id => id.split(',')))
  },
  clearActiveLocationIds (state) {
    state.activeLocationIds = []
  },
  setActiveRasterLayerId (state, id) {
    state.activeRasterLayerId = id
  },
  setVectorData (state, { id, data }) {
    Vue.set(state.vectorDataCollection, id, data)
  },
  setRasterData (state, { data }) {
    state.activeRasterData = data
  },
  setRasterProperty (state, { prop, data }) {
    state.activeRasterData.layer.properties[prop] = data
  },
  addActiveRasterLayer (state, { data }) {
    Vue.set(state.activeRasterData, 'layer', data)
  },
  addActiveFlowmapLayer (state, data) {
    state.activeFlowmapLayer = data
  },
  setLoadingRasterLayers (state, loading) {
    state.loadingRasterLayers = loading
  }
}

export const actions = {
  loadDatasets ({ state, commit, dispatch }) {
    // Retrieve the first 2 layers of the stac collection, the general metadata
    // and the childs including all datasets
    getCatalog(process.env.VUE_APP_CATALOG_URL)
      .then(datasets => {
        // Add themes to store.themes
        const themes = _.get(datasets, 'summaries.keywords')
        themes.forEach(theme => commit('addTheme', theme))

        const childs = datasets.links.filter(ds => ds.rel === 'child')
        return childs.forEach(child => {
          commit('addDataset', { id: child.title })
          return getCatalog(child.href)
            .then(dataset => {
              commit('addDataset', dataset)
              // If we start at a subroute with active dataset ids, directly
              // load the vector layers
              if (state.activeDatasetIds.includes(dataset.id)) {
                _.set(state.datasets, `${dataset.id}.visible`, true)
                dispatch('loadVectorLayer', dataset)
                dispatch('triggerActiveVector')
              }
              if (dataset.id === state.activeRasterLayerId) {
                dispatch('loadActiveRasterData', dataset.id)
              }
            })
        })
      })
  },
  loadActiveRasterData ({ state, commit, dispatch }, id) {
    // Store active raster data, if null leave empty, otherwise retrieve
    // new data from link
    if (!id) {
      commit('setRasterData', {})
      return
    }
    const links = _.get(state.datasets[id], 'links')
    const collectionUrl = links.find(child => child.title === `${id}-gee`).href
    getCatalog(collectionUrl)
      .then(dataset => {
        let links = _.get(dataset, 'links', [])
        links = links.filter(link => link.rel === 'item')
        const rasterLayer = links[links.length - 1]
        const result = links.map(serie => {
          serie.date = moment(serie.date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm')
          return serie
        })
        dataset.links = result
        commit('setRasterData', { id: id, data: dataset })

        dispatch('loadActiveRasterLayer', rasterLayer)
      })
    const flowUrl = links.find(child => child.title === `${id}-flow`)
    if (flowUrl) {
      getCatalog(flowUrl.href)
        .then(dataset => {
          commit('addActiveFlowmapLayer', dataset)
        })
    } else {
      commit('addActiveFlowmapLayer', {})
    }
  },
  loadActiveRasterLayer ({ state, getters, commit }, rasterLayer) {
    // Load the active item (depending on activeTimestamp), this function is also
    // used to update the raster layer when the min and max has changed (using the
    // properties of the activeRasterData)
    if (!rasterLayer) {
      rasterLayer = state.activeRasterData.links.find(item => {
        return getters.activeTimestamp === item.date
      })
    }

    // If no matching timestamp found by child, use collection of invalid date
    if (!rasterLayer) {
      rasterLayer = state.activeRasterData.links.find(item => item.rel === 'item')
    }

    const properties = _.get(state.activeRasterData, 'layer.properties', {})
    const url = new URL(rasterLayer.href)

    if (_.get(properties, 'deltares:band')) {
      url.searchParams.set('band', _.get(properties, 'deltares:band'))
    }

    if (_.get(properties, 'deltares:min')) {
      url.searchParams.set('min', _.get(properties, 'deltares:min'))
    }
    if (_.get(properties, 'deltares:max')) {
      url.searchParams.set('max', _.get(properties, 'deltares:max'))
    }
    getCatalog(url.href)
      .then(dataset => {
        commit('addActiveRasterLayer', { data: dataset })
        commit('setLoadingRasterLayers', false)
      })
  },

  storeActiveVectorIds ({ commit }, _ids) {
    // First set the activeDatasetIds
    const ids = isArray(_ids) ? _ids : _ids.split(',')
    commit('setActiveDatasetIds', ids)
  },

  triggerActiveVector ({ state, dispatch }) {
    // When changing the active vector layers, check whether a new vectorlayer needs
    // to be loaded.s
    state.activeDatasetIds.forEach(datasetId => {
      if (!_.has(state, `vectorDataCollection.${datasetId}`)) {
        dispatch('loadVectorLayer', (state.datasets[datasetId]))
      }
    })
  },
  loadVectorLayer ({ state, dispatch }, dataset) {
    if (!dataset) {
      return
    }
    if (!_.has(state.vectorDataCollection, dataset.id)) {
      const links = _.get(dataset, 'links', [])
      const item = links.find(child => child.title === `${dataset.id}-mapbox`)
      const collectionUrl = _.get(item, 'href')
      if (!collectionUrl) {
        return
      }
      dispatch('loadLayerCollection', {
        collectionUrl,
        setCollectionCommit: 'setVectorData',
        datasetId: dataset.id
      })
    }
  },

  loadLayerCollection ({ commit }, { collectionUrl, setCollectionCommit, addLayerCommit, datasetId }) {
    // Retrieve a layer collection and it's underlaying collection
    getCatalog(collectionUrl)
      .then(dataset => {
        dataset.layers = []
        const itemLinks = _.get(dataset, 'links')
        const items = itemLinks.filter(child => child.rel === 'item')
        const layers = []
        items.forEach((item, index) => {
          getCatalog(item.href)
            .then(layerData => {
              // commit(addLayerCommit, { id: datasetId, data: layerData })
              layers.push(layerData)
              if (index === items.length - 1) {
                dataset.layers = layers
                commit(setCollectionCommit, { id: datasetId, data: dataset })
              }
            })
        })
      })
  },

  loadPointDataForLocation ({ commit, state, getters }, { datasetIds, locationId }) {
    const datasetIdsArray = isArray(datasetIds) ? datasetIds : datasetIds.split(',')
    datasetIdsArray.forEach(datasetId => {
      if (_.get(state, `datasets[${datasetId}]vector[${locationId}]`)) {
        return
      }

      // TODO: this time is still done for the old code. Needs update, use activeTimesatmp?
      // Get the current time of the active raster layer
      const activeRaster = _.get(getters, 'activeRasterData')
      let currentTime = _.get(activeRaster, 'date')

      let now = moment()
      const dateFormat = _.get(activeRaster, 'dateFormat')
      if (currentTime) {
        // If there is a date by the active raster layer, check if that date
        // falls within the range of the timeseries dates.
        const timeseries = _.get(state, `datasets[${datasetId}].raster.imageTimeseries`)
        let lastTime = _.get(_.last(timeseries), 'date')
        currentTime = moment(currentTime, dateFormat)
        lastTime = moment(lastTime, dateFormat)
        now = currentTime.isAfter(lastTime) ? lastTime : currentTime
      }

      const parameters = {
        locationId,
        startTime: moment(now, dateFormat)
          .subtract(5, 'days')
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: moment(now, dateFormat)
          .add(5, 'days')
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        datasetId
      }

      const url = _.get(state, `vectorDataCollection[${datasetId}].assets.graph.href`)
      if (!url) {
        return
      }
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(parameters),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(response => {
          const pointDataType = _.get(state, `vectorDataCollection[${datasetId}].properties.deltares:pointData`)
          // Depending on the pointDataType different responses are expected.
          // images -> just an url to a svg image
          // line or scatter -> data to create echarts graph
          if (pointDataType === 'images') {
            commit('addDatasetPointData', {
              id: datasetId,
              data: {
                [locationId]: {
                  imageUrl: response,
                  type: pointDataType
                }
              }
            })
          } else {
            let category = []
            let serie = []
            const eventResults = response.results.filter(res => _.has(res, 'events'))

            eventResults.forEach(res => {
              serie = serie.concat(res.events.map(event => event.value))
              category = category.concat(res.events.map(event => moment(event.timeStamp).format()))
            })

            commit('addDatasetPointData', {
              id: datasetId,
              data: {
                [locationId]: {
                  category,
                  serie,
                  type: pointDataType
                }
              }
            })
          }
        })
    })
  }
}

export const getters = {
  activeDatasetIds (state) {
    return state.activeDatasetIds
  },
  // TODO: check if  all these functions are needed/used
  getActiveTheme (state) {
    return state.activeTheme
  },
  getGeographicalScope (state) {
    return state.geographicalScope
  },
  getDatasets (state) {
    return state.datasets
  },
  getActiveRasterLayer (state) {
    return state.activeRasterLayerId
  },
  getLoadingState (state) {
    return state.loadingRasterLayers
  },
  activeTimestamp (state, { activeRasterData }) {
    if (state.loadingRasterLayers) {
      return 'Loading...'
    }
    // Retrieve the timestamp from te activeRasterData and combine this into a string
    // using the dateformat given
    const date = _.get(activeRasterData, 'layer.properties.deltares:date', [])
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    if (date) {
      const timeStamp = moment(date, dateFormat).format('DD-MM-YYYY HH:mm')
      return timeStamp
    } else {
      return ''
    }
  },
  activeRasterData (state) {
    return state.activeRasterData
  },
  activeFlowmapData (state) {
    return state.activeFlowmapLayer
  },
  activeVectorData (state) {
    return state.vectorDataCollection
  },
  loadingRasterLayers (state) {
    return state.loadingRasterLayers
  },
  activePointDataPerDataset (state) {
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
        locData.datasetName = _.get(data, 'title')
        locData.units = _.get(data, 'properties.deltares:units')
        locData.id = _.get(data, 'id')
        return locData
      })
    })
    return activePointDataPerDataset
  },
  datasetsInActiveTheme (state) {
    const sets = _.values(state.datasets)
    const activeSets = {}
    if (state.activeTheme !== '') {
      sets.forEach(set => {
        if (set.keywords.includes(state.activeTheme)) {
          activeSets[set.id] = set
        }
      })
      return activeSets
    } else {
      return state.datasets
    }
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
  modules: {
    datasets,
    themes
  }
}
