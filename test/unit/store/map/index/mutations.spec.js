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

describe('setActiveTheme', () => {
  test('updates state.activeTheme with ids in payload', () => {
    const state = {
      activeTheme: {},
      themes: {
        ab: {
          cd: 'ef',
          id: 'ab',
        },
      },
    }
    const ids = 'ab'
    mutations.setActiveTheme(state, ids)
    expect(state.activeTheme).toEqual({
      cd: 'ef',
      id: 'ab',
    })
    mutations.setActiveTheme(state, ids)
    expect(state.activeTheme).toEqual({})
  })
})

describe('clearActiveTheme', () => {
  test('clears state.activeTheme', () => {
    const state = {
      activeTheme: 'ab',
    }
    mutations.clearActiveTheme(state)
    expect(state.activeTheme).toEqual({})
  })
})

describe('setActiveLocationIds', () => {
  test('updates state.setActiveLocationIds with ids in payload', () => {
    const state = {
      activeLocationIds: [],
    }
    const ids = ['wl', 'wd']
    mutations.setActiveLocationIds(state, ids)
    expect(state.activeLocationIds).toEqual(ids)
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
