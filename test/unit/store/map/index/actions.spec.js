import moment from 'moment'
import loadLocations from '../../../../../lib/load-locations'
jest.mock('../../../../../lib/load-locations', () => (_, fn) => {
  fn([{ properties: { locationId: 'foo' } }])
})
import { actions } from '../../../../../store/map/index.js' // eslint-disable-line
import getFromApi from '../../../../../lib/request/get' // eslint-disable-line
jest.mock('../../../../../lib/request/get')

describe('loadThemes', () => {
  test('fetches datasets and stores them', async () => {
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
})

describe('loadLocationsInDatasets', () => {
  test('loads locations for datasets and stores them', async () => {
    const apiResult = {
      paging: {
        maxPageSize: 4,
        minPageSize: 1,
        next: 'http://localhost:5000/locations?&page=2&datasetId=wd',
        prev: null,
        totalObjectCount: 1,
      },
      results: [
        {
          features: [{ properties: { locationId: 'foo' } }],
        },
      ],
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
    expect(commit.mock.calls[0][0]).toBe('setActiveDatasetIds')
    expect(commit.mock.calls[0][1]).toEqual(['wl'])
    expect(commit.mock.calls[1][0]).toBe('datasets/addDatasetLocations')
    expect(commit.mock.calls[1][1]).toEqual({
      data: {
        features: apiResult.results[0].features,
        type: 'FeatureCollection',
      },
      id: 'wl',
    })
  })

  test('returns object of known ids of datasets provided as string', async () => {
    const apiResult = {
      paging: {
        maxPageSize: 4,
        minPageSize: 1,
        next: 'http://localhost:5000/locations?&page=2&datasetId=wd',
        prev: null,
        totalObjectCount: 1,
      },
      results: [
        {
          features: [{ properties: { locationId: 'foo' } }],
        },
      ],
    }
    getFromApi.mockResolvedValue(apiResult)
    const commit = jest.fn()
    const _ids = 'wl'
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
    expect(commit.mock.calls[0][0]).toBe('setActiveDatasetIds')
    expect(commit.mock.calls[0][1]).toEqual(['wl'])
    expect(commit.mock.calls[1][0]).toBe('datasets/addDatasetLocations')
    expect(commit.mock.calls[1][1]).toEqual({
      data: {
        features: apiResult.results[0].features,
        type: 'FeatureCollection',
      },
      id: 'wl',
    })
  })
})

describe('loadPointDataForLocation', () => {
  test('loads point data for the specified location', async () => {
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
          },
        },
      },
    ])
  })

  test('loads point data for the specified location in string format', async () => {
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
      { datasetIds: 'ab,cd', locationId: 'ef' },
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
          },
        },
      },
    ])
  })
})
