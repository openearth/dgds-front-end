import { mutations } from '../../../../../store/map/index.js'

test('setActiveDatasetIds updates state.activeDatasetIds with ids in payload', () => {
  const state = {
    activeDatasetIds: [],
  }
  const ids = ['wl', 'wd']
  mutations.setActiveDatasetIds(state, ids)
  expect(state.activeDatasetIds).toBe(ids)
})

test('clearActiveDatasetIds clears state.activeDatasetIds', () => {
  const state = {
    activeDatasetIds: ['wl', 'wd'],
  }
  const ids = []
  mutations.clearActiveDatasetIds(state)
  expect(state.activeDatasetIds).toEqual(ids)
})

test('setActiveLocationIds updates state.setActiveLocationIds with ids in payload', () => {
  const state = {
    activeLocationIds: [],
  }
  const ids = ['wl', 'wd']
  mutations.setActiveLocationIds(state, ids)
  expect(state.activeLocationIds).toBe(ids)
})

test('setActiveLocationIds clears state.activeLocationIds', () => {
  const state = {
    activeLocationIds: ['wl', 'wd'],
  }
  const ids = []
  mutations.clearActiveLocationIds(state)
  expect(state.activeLocationIds).toEqual(ids)
})
