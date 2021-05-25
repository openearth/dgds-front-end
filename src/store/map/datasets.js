import Vue from 'vue'
import get from 'lodash/fp/get'
import pipe from 'lodash/fp/pipe'
import merge from 'lodash/fp/merge'
import identity from 'lodash/fp/identity'
import { when } from '@/lib/utils'

const emptyObject = () => ({})

const getOrEmpty = empty => when(identity, identity, empty)
const getOrEmptyPointData = getOrEmpty(emptyObject)

const getPointData = pipe([get('pointData'), getOrEmptyPointData])

export const state = () => ({})

export const mutations = {
  addDatasetPointData (state, { id, data }) {
    if (!state[id]) Vue.set(state, id, {})
    const pointData = getPointData(state[id])
    Vue.set(state[id], 'pointData', merge(pointData, data))
  },
  addDataset (state, dataset) {
    Vue.set(state, dataset.id, dataset)
  }
}

export default {
  state,
  mutations
}
