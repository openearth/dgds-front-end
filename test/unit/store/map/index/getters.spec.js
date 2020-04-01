import update from 'lodash/fp/update'
import { getters } from '../../../../../store/map/index.js'

describe('getActiveTheme', () => {
  test('returns activeTheme', () => {
    const state = {
      activeTheme: 'theme1',
    }
    const result = getters.getActiveTheme(state)
    expect(result).toEqual('theme1')
  })
})

describe('getGeographicalScope', () => {
  test('returns geographicalScope', () => {
    const state = {
      geographicalScope: 'global',
    }
    const result = getters.getGeographicalScope(state)
    expect(result).toEqual('global')
  })
})

describe('getDatasets', () => {
  test('returns datasets', () => {
    const state = {
      datasets: 'wl',
    }
    const result = getters.getDatasets(state)
    expect(result).toEqual('wl')
  })
})

describe('knownDatasetIds', () => {
  test('returns array of known dataset ids', () => {
    const state = {
      datasets: {
        wl: {},
        wd: {},
      },
    }
    const ids = ['wl', 'wd']
    const result = getters.knownDatasetIds(state)
    expect(result).toEqual(ids)
  })
})

describe('knownLocationIds', () => {
  const state = {
    datasets: {
      wl: {
        locations: {
          features: [],
        },
      },
      wd: {
        locations: {
          features: [],
        },
      },
    },
  }

  test('returns an empty array when no locations are present', () => {
    const result = getters.knownLocationIds(state)
    expect(result).toHaveLength(0)
  })

  test('returns array with one location if only one id is present', () => {
    const newState = update(
      'datasets.wl.locations.features',
      _ => [{ properties: { locationId: 'WL-Loc1' } }],
      state,
    )
    const result = getters.knownLocationIds(newState)
    expect(result).toEqual(['WL-Loc1'])
  })

  test('returns array with multiple locations if multiple ids are present', () => {
    let newState = update(
      'datasets.wl.locations.features',
      _ => [{ properties: { locationId: 'WL-Loc1' } }],
      state,
    )
    newState = update(
      'datasets.wd.locations.features',
      _ => [{ properties: { locationId: 'WD-Loc2' } }],
      newState,
    )
    const result = getters.knownLocationIds(newState)
    expect(result).toEqual(['WL-Loc1', 'WD-Loc2'])
  })
})

describe('activeDatasets', () => {
  const state = {
    activeDatasetIds: ['wl'],
    datasets: {
      wl: {
        data: 'test-wl',
      },
      wd: {
        data: 'test-wd',
      },
    },
  }
  test('returns array with one item when one active dataset is present', () => {
    const result = getters.activeDatasets(state)
    expect(result).toEqual([state.datasets.wl])
  })
  test('returns array with multiple items when multiple active datasets are present', () => {
    const newState = update('activeDatasetIds', _ => ['wl', 'wd'], state)
    const result = getters.activeDatasets(newState)
    expect(result).toEqual([state.datasets.wl, state.datasets.wd])
  })
})

describe('activeTimestamp', () => {
  test('returns Loading... when no loadingRasterLayers is true is available', () => {
    const state = {
      loadingRasterLayers: true,
    }
    const result = getters.activeTimestamp(state, state)
    expect(result).toBe('Loading...')
  })
  test('returns empty when no activeRasterData is available', () => {
    const state = {
      activeRasterData: [],
    }
    const result = getters.activeTimestamp(state, state)
    expect(result).toBe('')
  })
  test('returns date in DD-MM-YYYY HH:MM when activeRasterData is available and a correct time string', () => {
    const state = {
      activeRasterData: {
        date: '2011-12-01 00:01',
        dateFormat: 'YYYY-MM-DD HH:mm',
      },
    }
    const result = getters.activeTimestamp(state, state)
    expect(result).toBe('01-12-2011 00:01')
  })

  test('returns empty when date is not defined', () => {
    const state = {
      activeRasterData: {
        dateFormat: 'YYYY-MM-DD',
      },
    }
    const result = getters.activeTimestamp({}, state)
    expect(result).toBe('')
  })

  test('returns empty when dateFormat is not defined', () => {
    const state = {
      activeRasterData: {
        date: '2011-12-01',
      },
    }
    const result = getters.activeTimestamp({}, state)
    expect(result).toBe('')
  })

  test('returns date when activeRasterData is available and not a correct time string', () => {
    const state = {
      activeRasterData: ['foo'],
    }
    const result = getters.activeTimestamp({}, state)
    expect(result).toBe('')
  })
})

describe('activeRasterData', () => {
  const state = {
    activeRasterLayerId: '',
    datasets: {
      foo: {
        raster: {
          tiles: ['bar'],
        },
      },
    },
  }
  test('return empty array when no active raster data', () => {
    const result = getters.activeRasterData(state)
    expect(result).toEqual([])
  })

  test('return the tiles of the active raster data', () => {
    state.activeRasterLayerId = 'foo'
    const result = getters.activeRasterData(state)
    expect(result).toEqual({ tiles: ['bar'] })
  })
})

describe('activeRasterLegendData', () => {
  const state = {
    activeRasterLayerId: '',
    datasets: {
      foo: {
        raster: {
          linearGradient: 'LG',
          min: 'min',
          max: 'max',
        },
      },
    },
  }
  test('return empty array when no active raster data', () => {
    const result = getters.activeRasterLegendData(state)
    expect(result).toEqual([])
  })
  test('return the tiles of the active raster data', () => {
    state.activeRasterLayerId = 'foo'
    const result = getters.activeRasterLegendData(state)
    expect(result).toEqual({
      linearGradient: 'LG',
      min: 'min',
      max: 'max',
    })
  })
})

describe('activeVectorData', () => {
  const state = {
    activeLocationIds: ['loc1'],
    activeDatasets: [
      {
        vector: {
          mapboxLayer: 'mblayer',
        },
      },
    ],
  }
  test('return active vector data', () => {
    const result = getters.activeVectorData(state, state)
    expect(result).toEqual(['mblayer'])
  })
})

describe('activeDatasetsLocations', () => {
  test('returns array of datasets for the active locations', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDatasets: [
        {
          locations: {
            features: [
              {
                properties: {
                  locationId: 'WL-Loc1',
                },
              },
            ],
          },
          pointData: {
            'WL-Loc1': {
              data: 'test-wl-loc1',
            },
            'WL-Loc2': {
              data: 'test-wl-loc2',
            },
          },
        },
      ],
    }
    const result = getters.activeDatasetsLocations(state, state)
    expect(result).toEqual([
      { features: [{ properties: { active: true, locationId: 'WL-Loc1' } }] },
    ])
  })
})

describe('activePointDataPerDataset', () => {
  test('ignores unknown datasets ids', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDatasetIds: ['wl', 'wd'],
      datasets: { wl: { pointData: { foo: 'bar' } } },
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
          metadata: { name: 'Test WL' },
          locations: {
            features: [
              {
                properties: {
                  locationId: 'WL-Loc1',
                },
              },
            ],
          },
          pointData: {
            'WL-Loc1': {
              data: 'test-wl-loc1',
            },
            'WL-Loc2': {
              data: 'test-wl-loc2',
            },
          },
        },
        wd: {
          locations: {
            features: [],
          },
        },
      },
    }
    const result = getters.activePointDataPerDataset(state)
    expect(result['WL-Loc1']).toEqual([
      {
        datasetName: 'Test WL',
        data: 'test-wl-loc1',
      },
    ])
  })
})

describe('datasetsInActiveTheme', () => {
  test('returns array of datasets belonging to active theme', () => {
    const state = {
      activeDatasetIds: ['bar'],
      activeTheme: {
        datasets: ['foo'],
      },
      datasets: {
        foo: { metadata: { id: 'foo' } },
        bar: { metadata: { id: 'bar' } },
      },
    }
    const result = getters.datasetsInActiveTheme(state)
    expect(result).toEqual([{ id: 'foo', visible: false }])
  })

  test('returns array of datasets selected if no theme is active', () => {
    const state = {
      activeDatasetIds: ['bar'],
      activeTheme: {},
      datasets: {
        foo: { metadata: { id: 'foo' } },
        bar: { metadata: { id: 'bar' } },
      },
    }
    const result = getters.datasetsInActiveTheme(state)
    expect(result).toEqual([
      { id: 'foo', visible: false },
      { id: 'bar', visible: true },
    ])
  })
})
