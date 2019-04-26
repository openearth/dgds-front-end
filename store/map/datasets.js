import Vue from 'vue'
import get from 'lodash/fp/get'
import pipe from 'lodash/fp/pipe'
import merge from 'lodash/fp/merge'
import identity from 'lodash/fp/identity'
import { when } from '../../lib/utils'

const getOrEmptyObject = when(identity, identity, () => {})
const getPointData = pipe([get('pointData'), getOrEmptyObject])
const getLocations = pipe([get('locations'), getOrEmptyObject])
const getSpatialData = pipe([get('spatial'), getOrEmptyObject])
const getMetadata = pipe([get('metadata'), getOrEmptyObject])

export const state = () => ({})

export const mutations = {
  addDatasetLocations(state, { id, data }) {
    if (!state[id]) Vue.set(state, id, {})
    const locations = getLocations(state[id])
    Vue.set(state[id], 'locations', merge(locations, data))
  },
  addDatasetSpatial(state, data) {
    const id = data.id
    if (!state[id]) Vue.set(state, id, {})
    const spatialData = getSpatialData(state[id])
    Vue.set(state[id], 'spatial', merge(spatialData, { tiles: data.wmsUrl }))
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
