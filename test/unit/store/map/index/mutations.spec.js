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

describe('setGeographicalScope', () => {
  test('updates state.setGeographicalScope with scope in payload', () => {
    const state = {
      geographicalScope: [],
    }
    const scope = 'global'
    mutations.setGeographicalScope(state, scope)
    expect(state.geographicalScope).toBe(scope)
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

describe('toggleActiveTheme', () => {
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
    mutations.toggleActiveTheme(state, ids)
    expect(state.activeTheme).toEqual({
      cd: 'ef',
      id: 'ab',
    })
    mutations.toggleActiveTheme(state, ids)
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

describe('setActiveRasterLayer', () => {
  test('set state.activeRasterLayerId with id in payload', () => {
    const state = {
      activeRasterLayerId: 'wl',
    }
    mutations.setActiveRasterLayer(state, 'wd')
    expect(state.activeRasterLayerId).toEqual('wd')
  })
})

describe('toggleCollapsedDataset', () => {
  test('add or remove id from state.collapsedDatasets with id in payload', () => {
    const state = {
      collapsedDatasets: [],
    }
    mutations.toggleCollapsedDataset(state, 'wd')
    expect(state.collapsedDatasets).toEqual(['wd'])

    mutations.toggleCollapsedDataset(state, 'wd')
    expect(state.collapsedDatasets).toEqual([])
  })
})
