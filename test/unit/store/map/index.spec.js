// import actions from '../../../../store/map/index.js'
import { mutations, getters, actions } from '../../../../store/map/index.js'
import getFromApi from '../../../../lib/request/get'
jest.mock('../../../../lib/request/get')

describe('mutations', () => {
  test('setActiveDataSetIds updates state.activeDataSetIds with ids in payload', () => {
    const state = {
      activeDataSetIds: [],
    }
    const ids = ['wl', 'wd']
    mutations.setActiveDataSetIds(state, ids)
    expect(state.activeDataSetIds).toBe(ids)
  })

  test('clearActiveDataSetIds clears state.activeDataSetIds', () => {
    const state = {
      activeDataSetIds: ['wl', 'wd'],
    }
    const ids = []
    mutations.clearActiveDataSetIds(state)
    expect(state.activeDataSetIds).toEqual(ids)
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

  test('addDataSetLocations updates state.addDataSetLocations with payload', () => {
    const state = {
      dataSets: {
        wl: {
          locations: {},
        },
      },
    }
    const id = 'wl'
    const data = ['test']

    mutations.addDataSetLocations(state, { id, data })
    expect(state.dataSets[id].locations).toBe(data)
  })

  test('addDataSetPointData updates state.addDataSetPointData with payload', () => {
    const state = {
      dataSets: {
        wl: {
          pointData: {},
        },
      },
    }
    const id = 'wl'
    const data = ['test']

    mutations.addDataSetPointData(state, { id, data })
    expect(state.dataSets[id].pointData).toBe(data)
  })
})

describe('getters', () => {
  test('knownDataSetIds returns object of known ids of datasets', () => {
    const state = {
      dataSets: {
        wl: {},
        wd: {},
      },
    }
    const ids = ['wl', 'wd']
    const result = getters.knownDataSetIds(state)
    expect(result).toHaveLength(2)
    expect(typeof result).toBe('object')
    expect(result).toEqual(ids)
  })

  test('knownLocationIds returns object of known location ids', () => {
    const state = {
      dataSets: {
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
    state.dataSets.wl.locations.features.push({
      properties: {
        locationId: 'WL-Loc1',
      },
    })
    result = getters.knownLocationIds(state)
    expect(result).toHaveLength(1)
    expect(result).toEqual(['WL-Loc1'])

    state.dataSets.wd.locations.features.push({
      properties: {
        locationId: 'WD-Loc2',
      },
    })
    result = getters.knownLocationIds(state)
    expect(result).toHaveLength(2)
    expect(result).toEqual(['WL-Loc1', 'WD-Loc2'])
  })

  test('activeDataSets returns object with the active dataset', () => {
    const state = {
      activeDataSetIds: ['wl'],
      dataSets: {
        wl: {
          data: 'test-wl',
        },
        wd: {},
      },
    }
    let result = getters.activeDataSets(state)
    expect(typeof result).toBe('object')
    expect(result).toEqual([state.dataSets.wl])

    state.activeDataSetIds.push('wd')
    result = getters.activeDataSets(state)
    expect(result).toEqual([state.dataSets.wl, state.dataSets.wd])

    // state.activeDataSetIds.push('test')
    // result = getters.activeDataSets(state)
    // expect(result).toEqual([state.dataSets.wl, state.dataSets.wd])
  })

  test('activeDataSetsLocations returns object of datasets for the active locations', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDataSets: [
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
    const result = getters.activeDataSetsLocations(state, state)
    expect(typeof result).toBe('object')
    expect(result).toEqual([
      { features: [{ properties: { active: true, locationId: 'WL-Loc1' } }] },
    ])
  })

  test('activePointDataPerDataSet returns object of pointdata for the active locations', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDataSetIds: ['wl'],
      dataSets: {
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
    const result = getters.activePointDataPerDataSet(state)
    expect(typeof result).toBe('object')
    expect(result['WL-Loc1']).toEqual([
      {
        data: 'test-wl-loc1',
      },
    ])
  })
})

describe('actions', () => {
  test('loadLocationsInDataSets returns object of known ids of datasets', async () => {
    const apiResult = {
      result: {
        features: 'test',
      },
    }
    getFromApi.mockResolvedValue(apiResult)
    const commit = jest.fn()
    const _ids = ['wl']
    const state = {
      dataSets: {
        wl: {},
        wd: {},
      },
      activeDataSetIds: [],
      activeLocationIds: [],
    }
    let get = {
      knownDataSetIds: ['wl'],
    }
    await actions.loadLocationsInDataSets({ commit, state, getters: get }, _ids)
    expect(commit).toHaveBeenCalledWith('setActiveDataSetIds', ['wl'])
    expect(commit).toHaveBeenCalledWith('addDataSetLocations', {
      data: { features: apiResult.features, type: 'FeatureCollection' },
      id: 'wl',
    })

    get = {
      knownDataSetIds: [],
    }
    await actions.loadLocationsInDataSets({ commit, state, getters: get }, _ids)
    expect(commit).toHaveBeenCalledWith('setActiveDataSetIds', [])
    expect(commit).not.toHaveBeenCalledWith('addDataSetLocations', {})
  })
})
