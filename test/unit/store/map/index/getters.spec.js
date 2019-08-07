import update from 'lodash/fp/update'
import { getters } from '../../../../../store/map/index.js'

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

// TODO: fix in Feat-theming-and-toggle-raster
// describe('activeRasterData', () => {
//   test('returns array with the current tile for the active dataset', () => {
//     const otherGetters = {
//       activeDatasets: [
//         {
//           metadata: {},
//           raster: { tiles: 'some/url' },
//         },
//       ],
//     }
//     const result = getters.activeRasterData({}, otherGetters)
//     expect(result).toEqual(['some/url'])
//   })
//   test('returns an empty array when tiles cant be found', () => {
//     const otherGetters = {
//       activeDatasets: [
//         {
//           metadata: {},
//         },
//       ],
//     }
//     const result = getters.activeRasterData({}, otherGetters)
//     expect(result).toEqual([])
//   })
// })

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
    expect(result).toEqual([
      { id: 'foo', visible: true },
      { id: 'bar', visible: false },
    ])
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
