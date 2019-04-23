import { mutations } from '../../../../../store/map/index.js'

describe('setActiveDatasetIds', () => {
  test('updates state.activeDatasetIds with ids in payload', () => {
    const state = {
      activeDatasetIds: [],
    }
    const ids = ['wl', 'wd']
    mutations.setActiveDatasetIds(state, ids)
    expect(state.activeDatasetIds).toBe(ids)
  })
})

describe('clearActiveDatasetIds', () => {
  test('clears state.activeDatasetIds', () => {
    const state = {
      activeDatasetIds: ['wl', 'wd'],
    }
    const ids = []
    mutations.clearActiveDatasetIds(state)
    expect(state.activeDatasetIds).toEqual(ids)
  })
})

describe('setActiveLocationIds', () => {
  test('updates state.setActiveLocationIds with ids in payload', () => {
    const state = {
      activeLocationIds: [],
    }
    const ids = ['wl', 'wd']
    mutations.setActiveLocationIds(state, ids)
    expect(state.activeLocationIds).toBe(ids)
  })
})

describe('setActiveLocationIds', () => {
  test('clears state.activeLocationIds', () => {
    const state = {
      activeLocationIds: ['wl', 'wd'],
    }
    const ids = []
    mutations.clearActiveLocationIds(state)
    expect(state.activeLocationIds).toEqual(ids)
  })
})
