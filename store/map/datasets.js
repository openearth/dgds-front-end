import Vue from 'vue'
import get from 'lodash/fp/get'
import pipe from 'lodash/fp/pipe'
import clone from 'lodash/fp/clone'
import merge from 'lodash/fp/merge'
import negate from 'lodash/fp/negate'
import includes from 'lodash/fp/includes'
import identity from 'lodash/fp/identity'
import { when, includesIn, freeze } from '../../lib/utils'

const getLocationId = get('properties.locationId')

const emptyObject = () => ({})
const emptyLocationsObject = () => ({ features: [], type: 'FeatureCollection' })

const getOrEmpty = empty => when(identity, identity, empty)
const getOrEmptyLocations = getOrEmpty(emptyLocationsObject)
const getOrEmptyPointData = getOrEmpty(emptyObject)
const getOrEmptyMetadata = getOrEmpty(emptyObject)
const getPointData = pipe([get('pointData'), getOrEmptyPointData])
const getLocations = pipe([get('locations'), getOrEmptyLocations])
const getMetadata = pipe([get('metadata'), getOrEmptyMetadata])

export const state = () => ({})

export const mutations = {
  addDatasetLocations(state, { id, data }) {
    if (!state[id]) Vue.set(state, id, { locations: emptyLocationsObject() })
    if (!state[id].locations)
      Vue.set(state[id], 'locations', emptyLocationsObject())

    const locations = getLocations(state[id])
    const currentLocationIds = locations.features.map(getLocationId)
    const isCurrentLocation = includesIn(currentLocationIds)
    const newFeatures = data.features
      .filter(pipe([getLocationId, negate(isCurrentLocation)]))
      .map(freeze)

    if (newFeatures.length > 0) {
      Vue.set(state[id].locations, 'features', [
        ...locations.features,
        ...newFeatures,
      ])
    }
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
