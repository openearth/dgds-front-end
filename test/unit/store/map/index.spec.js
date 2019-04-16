// import actions from '../../../../store/map/index.js'
import { mutations, getters, actions } from '../../../../store/map/index.js'
import getFromApi from '../../../../lib/request/get'
jest.mock('../../../../lib/request/get')

describe('mutations', () => {
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
})

describe('getters', () => {
  test('knownDatasetIds returns object of known ids of datasets', () => {
    const state = {
      datasets: {
        wl: {},
        wd: {},
      },
    }
    const ids = ['wl', 'wd']
    const result = getters.knownDatasetIds(state)
    expect(result).toHaveLength(2)
    expect(typeof result).toBe('object')
    expect(result).toEqual(ids)
  })

  test('knownLocationIds returns object of known location ids', () => {
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
    let result = getters.knownLocationIds(state)
    expect(result).toHaveLength(0)
    expect(typeof result).toBe('object')
    state.datasets.wl.locations.features.push({
      properties: {
        locationId: 'WL-Loc1',
      },
    })
    result = getters.knownLocationIds(state)
    expect(result).toHaveLength(1)
    expect(result).toEqual(['WL-Loc1'])

    state.datasets.wd.locations.features.push({
      properties: {
        locationId: 'WD-Loc2',
      },
    })
    result = getters.knownLocationIds(state)
    expect(result).toHaveLength(2)
    expect(result).toEqual(['WL-Loc1', 'WD-Loc2'])
  })

  test('activeDatasets returns object with the active dataset', () => {
    const state = {
      activeDatasetIds: ['wl'],
      datasets: {
        wl: {
          data: 'test-wl',
        },
        wd: {},
      },
    }
    let result = getters.activeDatasets(state)
    expect(typeof result).toBe('object')
    expect(result).toEqual([state.datasets.wl])

    state.activeDatasetIds.push('wd')
    result = getters.activeDatasets(state)
    expect(result).toEqual([state.datasets.wl, state.datasets.wd])

    // state.activeDatasetIds.push('test')
    // result = getters.activeDatasets(state)
    // expect(result).toEqual([state.datasets.wl, state.datasets.wd])
  })

  test('activeDatasetsLocations returns object of datasets for the active locations', () => {
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
    expect(typeof result).toBe('object')
    expect(result).toEqual([
      { features: [{ properties: { active: true, locationId: 'WL-Loc1' } }] },
    ])
  })

  test('activePointDataPerDataset returns object of pointdata for the active locations', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDatasetIds: ['wl'],
      datasets: {
        wl: {
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
    expect(typeof result).toBe('object')
    expect(result['WL-Loc1']).toEqual([
      {
        data: 'test-wl-loc1',
      },
    ])
  })
})

describe('actions', () => {
  test('loadLocationsInDatasets returns object of known ids of datasets', async () => {
    const apiResult = {
      result: {
        features: 'test',
      },
    }
    getFromApi.mockResolvedValue(apiResult)
    const commit = jest.fn()
    const _ids = ['wl']
    const state = {
      datasets: {
        wl: {},
        wd: {},
      },
      activeDatasetIds: [],
      activeLocationIds: [],
    }
    const get = {
      knownDatasetIds: ['wl'],
    }
    await actions.loadLocationsInDatasets({ commit, state, getters: get }, _ids)
    expect(commit).toHaveBeenCalledWith('setActiveDatasetIds', ['wl'])
    expect(commit).toHaveBeenCalledWith('datasets/addDatasetLocations', {
      data: { features: apiResult.features, type: 'FeatureCollection' },
      id: 'wl',
    })
  })
})
