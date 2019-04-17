// import actions from '../../../../store/map/index.js'
import moment from 'moment'
import {
  mutations,
  getters,
  actions,
  state,
} from '../../../../store/map/index.js'
import getFromApi from '../../../../lib/request/get'
jest.mock('../../../../lib/request/get')

describe('state', () => {
  test('Initial state', () => {
    const initialState = { activeDatasetIds: [], activeLocationIds: [] }
    expect(state()).toEqual(initialState)
  })
})

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

  test('activeDatasetsLocations ignores unknown datasets ids', () => {
    const state = {
      activeLocationIds: ['WL-Loc1'],
      activeDatasetIds: ['wl'],
      datasets: { wl: { pointData: { foo: 'bar' } } },
    }
    const result = getters.activePointDataPerDataset(state, state)
    expect(result).toEqual({ 'WL-Loc1': [{}] })
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

  test('datasetsInActiveTheme returns array of datasets for the current theme', () => {
    const state = {
      activeDatasetIds: ['bar'],
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

describe('actions', () => {
  test('loadThemes fetches data sets and stores them', async () => {
    const commit = jest.fn()
    const apiResult = {
      coastalManagement: {
        datasets: [{ id: 'ab', foo: 'bar' }, { id: 'cd', baz: 'blub' }],
      },
    }
    getFromApi.mockResolvedValue(apiResult)
    await actions.loadThemes({ commit })
    expect(commit.mock.calls[0]).toEqual([
      'themes/addTheme',
      { datasets: ['ab', 'cd'] },
    ])
    expect(commit.mock.calls[1]).toEqual([
      'datasets/addMetadata',
      {
        id: 'ab',
        foo: 'bar',
      },
    ])
    expect(commit.mock.calls[2]).toEqual([
      'datasets/addMetadata',
      {
        id: 'cd',
        baz: 'blub',
      },
    ])
  })

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

  test('loadPointDataForLocation', async () => {
    const commit = jest.fn()
    const timestamp = moment()
    const apiResult = {
      results: [
        {
          events: [
            {
              timestamp,
              value: 1,
            },
          ],
        },
      ],
    }
    getFromApi.mockResolvedValue(apiResult)
    await actions.loadPointDataForLocation(
      { commit },
      { datasetIds: ['ab', 'cd'], locationId: 'ef' },
    )
    expect(getFromApi).toHaveBeenCalledWith('timeseries', {
      datasetId: 'cd',
      endTime: moment()
        .add(5, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ'),
      locationCode: 'ef',
      startTime: moment()
        .subtract(3, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ'),
    })
    expect(commit.mock.calls[0]).toEqual([
      'datasets/addDatasetPointData',
      {
        id: 'ab',
        data: {
          ef: {
            category: [moment(timestamp).format('MM-DD-YYYY \n HH:mm')],
            serie: [1],
            title: 'ef',
          },
        },
      },
    ])
  })
})
