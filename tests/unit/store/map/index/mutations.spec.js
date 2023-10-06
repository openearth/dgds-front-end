import { mutations } from '@/store/map/index.js'

describe('resetMap', () => {
  test('updates all map related states to null', () => {
    const state = {
      activeDatasetIds: ['test'],
      activeLocationIds: ['ids'],
      activeTheme: 'theme',
      loadingRasterLayers: true
    }
    mutations.resetMap(state)
    expect(state.activeDatasetIds).toStrictEqual([])
    expect(state.activeLocationIds).toStrictEqual([])
    expect(state.activeTheme).toBe('')
    expect(state.loadingRasterLayers).toBe(false)
  })
})

describe('setActiveDatasetIds', () => {
  test('updates state.activeDatasetIds with ids in payload', () => {
    const state = {
      activeDatasetIds: []
    }
    const ids = ['wl', 'wd']
    mutations.setActiveDatasetIds(state, ids)
    expect(state.activeDatasetIds).toBe(ids)
  })
})

describe('setGeographicalScope', () => {
  test('updates state.setGeographicalScope with scope in payload', () => {
    const state = {
      geographicalScope: []
    }
    const scope = 'global'
    mutations.setGeographicalScope(state, scope)
    expect(state.geographicalScope).toBe(scope)
  })
})

describe('clearActiveDatasetIds', () => {
  test('clears state.activeDatasetIds', () => {
    const state = {
      activeDatasetIds: ['wl', 'wd']
    }
    const ids = []
    mutations.clearActiveDatasetIds(state)
    expect(state.activeDatasetIds).toEqual(ids)
  })
})

describe('toggleActiveTheme', () => {
  test('updates state.activeTheme with ids in payload', () => {
    const state = {
      activeTheme: ''
    }
    const theme = 'ab'
    mutations.toggleActiveTheme(state, theme)
    expect(state.activeTheme).toEqual('ab')
    mutations.toggleActiveTheme(state, theme)
    expect(state.activeTheme).toEqual('')
  })
})

describe('clearActiveTheme', () => {
  test('clears state.activeTheme', () => {
    const state = {
      activeTheme: 'ab'
    }
    mutations.clearActiveTheme(state)
    expect(state.activeTheme).toEqual({})
  })
})

describe('setActiveLocationIds', () => {
  test('updates state.setActiveLocationIds with ids in payload', () => {
    const state = {
      activeLocationIds: []
    }
    const ids = ['wl', 'wd']
    mutations.setActiveLocationIds(state, ids)
    expect(state.activeLocationIds).toEqual(ids)
  })
})

describe('clearActiveLocationIds', () => {
  test('clears state.activeLocationIds', () => {
    const state = {
      activeLocationIds: ['wl', 'wd']
    }
    const ids = []
    mutations.clearActiveLocationIds(state)
    expect(state.activeLocationIds).toEqual(ids)
  })
})

describe('setActiveRasterLayerId', () => {
  test('set state.activeRasterLayerId with id in payload', () => {
    const state = {
      activeRasterLayerId: 'wl'
    }
    mutations.setActiveRasterLayerId(state, 'wd')
    expect(state.activeRasterLayerId).toEqual('wd')
  })
})

describe('setVectorData', () => {
  test('set state.vectorDataCollection with id in payload', () => {
    const state = {
      vectorDataCollection: {}
    }
    mutations.setVectorData(state, { id: 'foo', data: ['bar'] })
    expect(state.vectorDataCollection).toEqual({ foo: ['bar'] })
  })
})

describe('setRasterData', () => {
  test('set state.activeRasterData with id in payload', () => {
    const state = {
      activeRasterData: ''
    }
    mutations.setRasterData(state, { data: 'foo' })
    expect(state.activeRasterData).toEqual('foo')
  })
})

describe('setRasterProperty', () => {
  test('set state.setRasterProperty.layer.properties.id with data in payload', () => {
    const state = {
      activeRasterData: {
        layer: {
          properties: {}
        }
      }
    }
    mutations.setRasterProperty(state, { prop: 'foo', data: 'bar' })
    expect(state.activeRasterData).toEqual({
      layer: {
        properties: {
          foo: 'bar'
        }
      }
    })
  })
})

describe('addActiveRasterLayer', () => {
  test('set state.activeRasterData with id in payload', () => {
    const state = {
      activeRasterData: {}
    }
    mutations.addActiveRasterLayer(state, { data: 'bar' })
    expect(state.activeRasterData).toEqual({ layer: 'bar' })
  })
})

describe('addActiveFlowmapLayer', () => {
  test('set state.activeFlowmapLayer with id in payload', () => {
    const state = {
      activeFlowmapLayer: ''
    }
    mutations.addActiveFlowmapLayer(state, 'foo')
    expect(state.activeFlowmapLayer).toEqual('foo')
  })
})

describe('setLoadingRasterLayers', () => {
  test('set state.loadingRasterLayers with id in payload', () => {
    const state = {
      loadingRasterLayers: false
    }
    mutations.setLoadingRasterLayers(state, true)
    expect(state.loadingRasterLayers).toEqual(true)
  })
})
