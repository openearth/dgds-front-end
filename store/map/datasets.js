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
const getOrEmptyMetadata = getOrEmpty(emptyObject)
const getPointData = pipe([get('pointData'), getOrEmptyPointData])
const getVectorData = pipe([get('vector'), getOrEmptyVector])
const getRasterData = pipe([get('raster'), getOrEmptyRaster])
const getMetadata = pipe([get('metadata'), getOrEmptyMetadata])

export const state = () => ({})

export const mutations = {
  addDatasetVector(state, data) {
    const id = _.get(data, 'id')
    if (!id) return
    if (!state[id]) Vue.set(state, id, {})
    const vectorData = getVectorData(state[id])

    const mapboxLayers = _.get(data, 'vectorLayer.mapboxLayers') || []
    const newMapboxLayers = mapboxLayers.map(layer => {
      layer.metadata = {
        locationIdField: _.get(data, 'locationIdField'),
        datasetId: _.get(layer, 'id'),
      }
      return layer
    })
    // TODO: make generic by looping over vectorLayer
    const mergedVector = _.merge({ mapboxLayer: newMapboxLayers }, vectorData)
    Vue.set(state[id], 'vector', mergedVector)
  },
  addDatasetRaster(state, data) {
    const id = _.get(data, 'id')
    // If id already has a rasterLayer return
    if (!id) return
    // else add to datasets
    if (!state[id]) Vue.set(state, id, {})
    const rasterData = getRasterData(state[id])
    const rasterLayer = merge(rasterData, {
      tiles: get('rasterLayer.url', data),
      linearGradient: _.get(data, 'rasterLayer.linearGradient'),
      min: _.get(data, 'rasterLayer.min'),
      max: _.get(data, 'rasterLayer.max'),
    })
    if (!_.get(data, 'rasterLayer.url')) return
    Vue.set(state[id], 'raster', rasterLayer)
  },
  addDatasetPointData(state, { id, data }) {
    if (!state[id]) Vue.set(state, id, {})
    const pointData = getPointData(state[id])
    Vue.set(state[id], 'pointData', merge(pointData, data))
  },
  addMetadata(state, _metadata) {
    if (!state[_metadata.id]) Vue.set(state, _metadata.id, {})
    const metadata = getMetadata(state[_metadata.id])
    Vue.set(state[_metadata.id], 'metadata', merge(metadata, _metadata))
  },
}
