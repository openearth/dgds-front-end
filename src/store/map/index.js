import isArray from 'lodash/isArray'
import flatten from 'lodash/fp/flatten'
import _ from 'lodash'
import moment from 'moment'
import getFromApi from '../../lib/request/get'
import getCatalog from '@/lib/request/get-catalog'
import datasets from './datasets.js'
import themes from './themes.js'

// const getId = get('id')

export const getDefaultState = () => ({
  activeDatasetIds: [],
  activeLocationIds: [],
  activeRasterData: {},
  vectorDataCollection: {},
  activeRasterLayerId: 'el',
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
    state.vectorDataCollection[id] = data
  },
  addActiveVectorLayer (state, { id, data }) {
    state.vectorDataCollection[id].layers.push(data)
  },
  setRasterData (state, { data }) {
    state.activeRasterData = data
  },
  addActiveRasterLayer (state, { data }) {
    state.activeRasterData.layer = data
  },
  // setActiveRasterData (state, data) {
  //   state.activeRasterData = data
  // },
  // setDefaultRasterLayer (state, id) {
  //   state.defaultRasterLayerId = id
  // },
  // updateRasterLayer (state, { dataset, rasterLayer }) {
  //   Object.assign(state.datasets[dataset].raster, rasterLayer)
  // },
  setLoadingRasterLayers (state, loading) {
    state.loadingRasterLayers = loading
  }
}

export const actions = {
  loadDatasets ({ commit, dispatch }) {
    // Retrieve the first 2 layers of the stac collection, the general metadata
    // and the childs including all datasets
    getCatalog(process.env.VUE_APP_CATALOG_URL)
      .then(datasets => {
        // Add themes to store.themes
        const themes = _.get(datasets, 'summaries.keywords')
        themes.forEach(theme => commit('addTheme', theme))

        const childs = datasets.links.filter(ds => ds.rel === 'child')
        childs.forEach(child => {
          getCatalog(child.href)
            .then(dataset => {
              commit('addDataset', dataset)
              // If we start at a subroute with active dataset ids, directly
              // load the vector layers
              if (state.activeDatasetIds.includes(dataset.id)) {
                _.set(state.datasets, `${dataset.id}.visible`, true)
                dispatch('loadVectorLayer', dataset)
              }
              if (dataset.id === state.activeRasterLayerId) {
                dispatch('loadActiveRasterData', dataset.id)
              }
            })
        })
      })
    // return getFromApi('datasets').then(val => {
    //   // Loop over datasets to get a list of available datasets per theme
    //   val.themes.map(theme => {
    //     theme.datasets = _.compact(
    //       val.datasets.map(set => {
    //         if (set.themes.includes(theme.id)) {
    //           return set.id
    //         }
    //       })
    //     )
    //     return theme
    //   })

    //   // Add themes to store.themes
    //   val.themes.forEach(theme => commit('addTheme', theme))

    //   val.datasets.forEach(set => {
    //     // Add metadata to store.datasets (excluding vectorLayer and rasterLayer)
    //     commit('addMetadata', _.omit(set, ['vectorLayer', 'rasterLayer', 'flowmapLayer']))

    //     // Add vectorlayer to store.datasets if available
    //     if (_.has(set, 'vectorLayer')) {
    //       commit('addDatasetVector', set)
    //     }

    //     // Flowmap for currents and  wind
    //     if (_.has(set, 'flowmapLayer')) {
    //       commit('addDatasetFlowmap', set)
    //     }
    //     // Add rasterLayer to store.datasets if available
    //     if (_.has(set, 'rasterLayer') && _.get(set, 'rasterLayer.url') !== null) {
    //       commit('addDatasetRaster', set)

    //       // If key rasterActiveOnLoad is true, turn this layer on on load
    //       const rasterActive = _.get(set, 'rasterActiveOnLoad')
    //       if (rasterActive) {
    //         commit('setActiveRasterLayer', set.id)
    //         commit('setDefaultRasterLayer', set.id)
    //       }
    //     }
    //   })
    // })
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
        commit('setRasterData', { id: id, data: dataset })
        let links = _.get(dataset, 'links', [])
        links = links.filter(link => link.rel === 'item')
        const rasterLayer = links[links.length - 1]
        dispatch('loadActiveRasterLayer', rasterLayer)
      })
  },
  loadActiveRasterLayer ({ state, commit }, rasterLayer) {
    getCatalog(rasterLayer.href)
      .then(dataset => {
        console.log(dataset)
        commit('addActiveRasterLayer', { data: dataset })
      })
  },
  // TODO: load active flowmap layer
  // loadActiveFlowmapLayer ({ state, commit }, flowLayer) {
  //   getCatalog(flowLayer.href)
  //     .then(dataset => {
  //       console.log(dataset)
  //       commit('addActiveRasterLayer', { data: dataset })
  //     })
  // },
  retrieveRasterLayerByImageId ({ commit, state, getters }, { imageId, options }) {
    options = options || {}
    commit('setLoadingRasterLayers', true)
    const dataset = getters.getActiveRasterLayer
    // If band has changed, use band from options. If band is not defined use already set band
    if (!_.get(options, 'band') && _.get(getters, 'activeRasterData.band')) {
      options.band = _.get(getters, 'activeRasterData.band')
    }

    if (!_.get(options, 'min') && _.get(getters, 'activeRasterData.min')) {
      options.min = _.get(getters, 'activeRasterData.min')
    }

    if (!_.get(options, 'max') && _.get(getters, 'activeRasterData.max')) {
      options.max = _.get(getters, 'activeRasterData.max')
    }
    const params = new URLSearchParams(options)
    // Retrieve complete new rasterLayer by imageId and dataset
    return getFromApi(`datasets/${dataset}/${imageId}?${params}`).then(val => {
      // If the range is set manually we don't want to update the default raster laayer
      commit('updateRasterLayer', { dataset, rasterLayer: val.rasterLayer })
      commit('setLoadingRasterLayers', false)
    })
  },

  storeActiveVectorIds ({ commit, state, getters, dispatch }, _ids) {
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
    if (!_.has(state.vectorDataCollection, dataset.id)) {
      const links = _.get(dataset, 'links')
      const collectionUrl = links.find(child => child.title === `${dataset.id}-mapbox`).href
      dispatch('loadLayerCollection', {
        collectionUrl,
        setCollectionCommit: 'setVectorData',
        addLayerCommit: 'addActiveVectorLayer',
        datasetId: dataset.id
      })
    }
  },

  loadLayerCollection ({ commit }, { collectionUrl, setCollectionCommit, addLayerCommit, datasetId }) {
    // Retrieve a layer collection and it's underlaying collection
    getCatalog(collectionUrl)
      .then(dataset => {
        dataset.layers = []
        commit(setCollectionCommit, { id: datasetId, data: dataset })
        const itemLinks = _.get(dataset, 'links')
        const items = itemLinks.filter(child => child.rel === 'item')
        items.forEach(item => {
          getCatalog(item.href)
            .then(layerData => {
              commit(addLayerCommit, { id: datasetId, data: layerData })
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
      getFromApi('', parameters, url)
        .then(response => {
          console.log(response)
          const pointDataType = _.get(state, `vectorDataCollection[${datasetId}].properties.deltaers:pointData`)

          // Depending on the pointDataType different responses are expected.
          // images -> just an url to a svg image
          // line or scatter -> data to create echarts graph
          if (pointDataType === 'images') {
            commit('addDatasetPointData', {
              id: datasetId,
              data: {
                [locationId]: {
                  imageUrl: response
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
                  serie
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
  getActiveRasterLayer (state, id) {
    return state.activeRasterLayerId
  },
  getLoadingState (state) {
    return state.loadingRasterLayers
  },
  // knownLocationIds (state) {
  //   const getInDatasets = getIn(state.datasets)
  //   const getLocationId = map(get('properties.locationId'))
  //   const featuresInDatasets = id => getInDatasets(`${id}.locations.features`)
  //   const getKnownLocationIds = pipe([
  //     Object.keys,
  //     filter(featuresInDatasets),
  //     map(pipe([featuresInDatasets, getLocationId])),
  //     flatten,
  //     uniq
  //   ])

  //   return getKnownLocationIds(state.datasets)
  // },

  activeDatasets (state) {
    return state.activeDatasetIds.map(id => {
      return _.get(state, `vectorDataCollection.${id}`)
    })
  },

  activeTimestamp (state, { activeRasterData }) {
    if (state.loadingRasterLayers) {
      return 'Loading...'
    }
    // Retrieve the timestamp from te activeRasterData and combine this into a string
    // using the dateformat given
    // let links = _.get(activeRasterData, 'links', [])
    // links = links.filter(link => link.rel === 'item')
    // const date = _.get(links[links.length - 1], 'date')
    const date = _.get(activeRasterData, 'layer.date', [])
    const dateFormat = 'YYYY-MM-DDTHH:mm:ss'
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

  // activeRasterData ({ datasets, activeRasterLayerId, activeDatasets }) {
  //   // Return the active raster data tiles (if not defined, return [])
  //   if (activeRasterLayerId === '' || activeRasterLayerId === null) {
  //     return []
  //   }
  //   return _.get(datasets, `${activeRasterLayerId}.raster`)
  // },

  activeFlowmapData ({ datasets, activeRasterLayerId }) {
    // return the  flowmap data
    if (activeRasterLayerId === '' || activeRasterLayerId === null) {
      return []
    }

    return _.get(datasets, `${activeRasterLayerId}.flowmap`)
  },

  activeVectorData (state) {
    // Retrieve a list with actual mapbox layers from the active vector layers
    const vectorDatasets = state.activeDatasetIds.map(datasetId => {
      return _.get(state, `vectorDataCollection.${datasetId}`)
    })

    const mapboxLayers = []
    vectorDatasets.forEach(dataset => {
      if (!_.has(dataset, 'layers')) {
        return
      }
      dataset.layers.forEach(layer => {
        const mapboxLayer = {}
        Object.entries(layer.properties).forEach(([id, prop]) => {
          const regex = 'deltares:(.+)'
          const propId = id.match(regex)
          if (_.get(propId, '1')) {
            mapboxLayer[propId[1]] = prop
          }
        })
        mapboxLayer.metadata = dataset.properties
        mapboxLayers.push(mapboxLayer)
      })
    })
    return mapboxLayers
    // return Object.values(state.vectorDataCollection).filter((id, data) => {
    //   console.log(data, id, state.activeDatasetIds.includes(id))
    //   return state.activeDatasetIds.includes(id)
    // })

    // Retrieve for active layers where vector data is available the data
    // const vectorLayers = activeDatasets.filter(has('vector'))
    // const mapboxLayers = vectorLayers.map(layer => {
    //   return get('vector.mapboxLayer', layer)
    // })
    // return mapboxLayers.filter(identity)
  },
  // activeDatasetsLocations ({ activeLocationIds }, { activeDatasets }) {
  //   // Retrieve for the active datasets the locations
  //   const getActiveProperty = feature =>
  //     pipe([get('properties.locationId'), includesIn(activeLocationIds), active => ({ active })])(
  //       feature
  //     )

  //   const addActiveProperty = feature =>
  //     pipe([
  //       get('properties'),
  //       merge(getActiveProperty(feature)),
  //       wrapInProperty('properties'),
  //       merge(feature)
  //     ])(feature)

  //   const enhanceFeatureWithActiveState = location =>
  //     pipe([get('features'), map(addActiveProperty), wrapInProperty('features'), merge(location)])(
  //       location
  //     )

  //   return activeDatasets
  //     .map(get('locations'))
  //     .filter(identity)
  //     .map(enhanceFeatureWithActiveState)
  // },
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
        locData.datasetName = _.get(data, 'metadata.name')
        locData.units = _.get(data, 'metadata.units')
        locData.type = _.get(data, 'metadata.pointData')
        locData.id = _.get(data, 'metadata.id')
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
