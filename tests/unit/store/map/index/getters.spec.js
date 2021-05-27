import { getters } from '@/store/map/index.js'

describe('activeDatasetIds', () => {
  test('returns activeDatasetIds', () => {
    const state = {
      activeDatasetIds: 'id1'
    }
    const result = getters.activeDatasetIds(state)
    expect(result).toEqual('id1')
  })
})

describe('getActiveTheme', () => {
  test('returns activeTheme', () => {
    const state = {
      activeTheme: 'theme1'
    }
    const result = getters.getActiveTheme(state)
    expect(result).toEqual('theme1')
  })
})

describe('getGeographicalScope', () => {
  test('returns geographicalScope', () => {
    const state = {
      geographicalScope: 'global'
    }
    const result = getters.getGeographicalScope(state)
    expect(result).toEqual('global')
  })
})

describe('getDatasets', () => {
  test('returns datasets', () => {
    const state = {
      datasets: 'wl'
    }
    const result = getters.getDatasets(state)
    expect(result).toEqual('wl')
  })
})

describe('getActiveRasterLayer', () => {
  test('returns activeRasterLayerId', () => {
    const state = {
      activeRasterLayerId: 'wl'
    }
    const result = getters.getActiveRasterLayer(state)
    expect(result).toEqual('wl')
  })
})

describe('getLoadingState', () => {
  test('returns loadingRasterLayers', () => {
    const state = {
      loadingRasterLayers: true
    }
    const result = getters.getLoadingState(state)
    expect(result).toEqual(true)
  })
})

describe('activeTimestamp', () => {
  test('returns Loading... when no loadingRasterLayers is true is available', () => {
    const state = {
      loadingRasterLayers: true
    }
    const result = getters.activeTimestamp(state, state)
    expect(result).toBe('Loading...')
  })
  test('returns empty when no activeRasterData is available', () => {
    const state = {
      activeRasterData: []
    }
    const result = getters.activeTimestamp(state, state)
    expect(result).toBe('Invalid date')
  })

  test('returns empty when date is not defined', () => {
    const state = {
      activeRasterData: {
        dateFormat: 'YYYY-MM-DD'
      }
    }
    const result = getters.activeTimestamp({}, state)
    expect(result).toBe('Invalid date')
  })

  test('returns empty when dateFormat is not defined', () => {
    const state = {
      activeRasterData: {
        date: '2011-12-01'
      }
    }
    const result = getters.activeTimestamp({}, state)
    expect(result).toBe('Invalid date')
  })

  test('returns date when activeRasterData is available and not a correct time string', () => {
    const state = {
      activeRasterData: ['foo']
    }
    const result = getters.activeTimestamp({}, state)
    expect(result).toBe('Invalid date')
  })
})

describe('activeRasterData', () => {
  test('returns activeRasterData', () => {
    const state = {
      activeRasterData: 'foo'
    }
    const result = getters.activeRasterData(state)
    expect(result).toEqual('foo')
  })
})

describe('activeFlowmapData', () => {
  test('returns activeFlowmapLayer', () => {
    const state = {
      activeFlowmapLayer: 'foo'
    }
    const result = getters.activeFlowmapData(state)
    expect(result).toEqual('foo')
  })
})

describe('activeVectorData', () => {
  test('returns vectorDataCollection', () => {
    const state = {
      vectorDataCollection: 'foo'
    }
    const result = getters.activeVectorData(state)
    expect(result).toEqual('foo')
  })
})

describe('activePointDataPerDataset', () => {
  test('ignores unknown datasets ids', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDatasetIds: ['wl', 'wd'],
      datasets: { wl: { pointData: { foo: 'bar' } } }
    }
    const result = getters.activePointDataPerDataset(state, state)
    expect(result).toEqual({ 'WL-Loc1': [] })
  })

  test('returns array of pointdata for the active locations', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDatasetIds: ['wl'],
      datasets: {
        wl: {
          title: 'Test WL',
          id: 'wl',
          properties: {
            'deltares:units': 'm'
          },
          pointData: {
            'WL-Loc1': {
              data: 'test-wl-loc1'
            },
            'WL-Loc2': {
              data: 'test-wl-loc2'
            }
          }
        },
        wd: {
        }
      }
    }
    const result = getters.activePointDataPerDataset(state)
    expect(result['WL-Loc1']).toEqual([
      {
        datasetName: 'Test WL',
        data: 'test-wl-loc1',
        id: 'wl',
        units: 'm'
      }
    ])
  })
})

describe('datasetsInActiveTheme', () => {
  test('returns array of datasets belonging to active theme', () => {
    const state = {
      activeDatasetIds: ['bar'],
      activeTheme: 'theme1',
      datasets: {
        foo: { id: 'foo', keywords: ['theme1'] },
        bar: { id: 'bar', keywords: ['theme2'] }
      }
    }
    const result = getters.datasetsInActiveTheme(state)
    expect(result).toEqual({ foo: { id: 'foo', keywords: ['theme1'] } })
  })

  test('returns array of datasets selected if no theme is active', () => {
    const state = {
      activeDatasetIds: ['bar'],
      activeTheme: '',
      datasets: {
        foo: { id: 'foo', keywords: ['theme1'] },
        bar: { id: 'bar', keywords: ['theme2'] }
      }
    }
    const result = getters.datasetsInActiveTheme(state)
    expect(result).toEqual({
      foo: { id: 'foo', keywords: ['theme1'] },
      bar: { id: 'bar', keywords: ['theme2'] }
    })
  })
})
