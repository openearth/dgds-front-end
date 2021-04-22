import Vue from 'vue'
import _ from 'lodash'
import get from 'lodash/fp/get'
import pipe from 'lodash/fp/pipe'
import merge from 'lodash/fp/merge'
import identity from 'lodash/fp/identity'
import { when } from '../../lib/utils'

const emptyObject = () => ({})
const emptyLocationsObject = () => ({})

const getOrEmpty = empty => when(identity, identity, empty)
const getOrEmptyVector = getOrEmpty(emptyLocationsObject)
const getOrEmptyPointData = getOrEmpty(emptyObject)
const getOrEmptyRaster = getOrEmpty(emptyObject)
const getOrEmptyFlowmap = getOrEmpty(emptyObject)
// const getOrEmptyMetadata = getOrEmpty(emptyObject)

const getPointData = pipe([get('pointData'), getOrEmptyPointData])
const getVectorData = pipe([get('vector'), getOrEmptyVector])
const getRasterData = pipe([get('raster'), getOrEmptyRaster])
const getFlowmapData = pipe([get('flowmap'), getOrEmptyFlowmap])
// const getMetadata = pipe([get('metadata'), getOrEmptyMetadata])

export const state = () => ({})

export const mutations = {
  addDatasetVector (state, data) {
    const id = _.get(data, 'id')
    if (!id) return
    if (!state[id]) Vue.set(state, id, {})
    const vectorData = getVectorData(state[id])

    const mapboxLayers = _.get(data, 'vectorLayer.mapboxLayers') || []
    const newMapboxLayers = mapboxLayers.map(layer => {
      layer.metadata = {
        locationIdField: _.get(data, 'locationIdField'),
        datasetId: _.get(layer, 'id')
      }
      return layer
    })
    // TODO: make generic by looping over vectorLayer
    const mergedVector = _.merge({ mapboxLayer: newMapboxLayers }, vectorData)
    Vue.set(state[id], 'vector', mergedVector)
  },
  addDatasetFlowmap (state, data) {
    // Follow the same approach as in addDatasetFlowmap
    const id = _.get(data, 'id')
    // update the flowmapLayer  with info  from the url
    if (!id) return
    if (!state[id]) Vue.set(state, id, {})
    const flowmapData = getFlowmapData(state[id])
    const flowmapLayer = merge(flowmapData, _.get(data, 'flowmapLayer'))
    Vue.set(state[id], 'flowmap', flowmapLayer)
  },
  addDatasetRaster (state, data) {
    const id = _.get(data, 'id')
    // If id already has a rasterLayer return
    if (!id) return
    // else add to datasets
    if (!state[id]) Vue.set(state, id, {})
    const rasterData = getRasterData(state[id])
    const rasterLayer = merge(rasterData, _.get(data, 'rasterLayer'))

    if (!_.get(data, 'rasterLayer.url')) return
    rasterLayer.tiles = [_.get(rasterLayer, 'url')]
    Vue.set(state[id], 'raster', rasterLayer)
  },
  addDatasetPointData (state, { id, data }) {
    if (!state[id]) Vue.set(state, id, {})
    const pointData = getPointData(state[id])
    Vue.set(state[id], 'pointData', merge(pointData, data))
  },
  addDataset (state, dataset) {
    console.log(dataset, dataset.id)
    Vue.set(state, dataset.id, dataset)
  }
  // addMetadata (state, _metadata) {
  //   if (!state[_metadata.id]) Vue.set(state, _metadata.id, {})
  //   const metadata = getMetadata(state[_metadata.id])
  //   Vue.set(state[_metadata.id], 'metadata', merge(metadata, _metadata))
  // }
}

export default {
  state,
  mutations
}
