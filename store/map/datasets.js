import Vue from 'vue'
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
    const id = get('id', data)
    if (!id) return
    if (!state[id]) Vue.set(state, id, {})
    const vectorData = getVectorData(state[id])
    Vue.set(
      state[id],
      'vector',
      // TODO: make generic by looping over vectorLayer
      merge(vectorData, { mapboxLayer: get('vectorLayer.mapboxLayer', data) }),
    )
  },
  addDatasetRaster(state, data) {
    const id = get('id', data)
    if (!id) return
    if (!state[id]) Vue.set(state, id, {})
    const rasterData = getRasterData(state[id])
    if (!get('rasterLayer.url')) return
    Vue.set(
      state[id],
      'raster',
      merge(rasterData, { tiles: get('rasterLayer.url', data) }),
    )
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
