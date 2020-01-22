import moment from 'moment'
import { actions } from '../../../../../store/map/index.js'
import getFromApi from '../../../../../lib/request/get'

jest.mock('../../../../../lib/request/get')

describe('loadDatasets', () => {
  test('fetches datasets and stores them', async () => {
    const commit = jest.fn()
    const apiResult = {
      themes: [{ id: 'theme1', name: 'theme1Name' }],
      datasets: [
        { id: 'par1', foo: 'bar', themes: ['theme1'], vectorLayer: {} },
        { id: 'par2', baz: 'blub', themes: ['theme2'], rasterLayer: {} }
      ]
    }
    getFromApi.mockResolvedValue(apiResult)
    await actions.loadDatasets({ commit })
    expect(commit.mock.calls[0]).toEqual([
      'themes/addTheme',
      { id: 'theme1', name: 'theme1Name', datasets: ['par1'] }
    ])
    expect(commit.mock.calls[1]).toEqual([
      'datasets/addMetadata',
      {
        id: 'par1',
        foo: 'bar',
        themes: ['theme1']
      }
    ])
    expect(commit.mock.calls[2]).toEqual([
      'datasets/addDatasetVector',
      { id: 'par1', foo: 'bar', themes: ['theme1'], vectorLayer: {} }
    ])
    expect(commit.mock.calls[3]).toEqual([
      'datasets/addMetadata',
      {
        id: 'par2',
        baz: 'blub',
        themes: ['theme2']
      }
    ])
    expect(commit.mock.calls[4]).toEqual([
      'datasets/addDatasetRaster',
      { id: 'par2', baz: 'blub', themes: ['theme2'], rasterLayer: {} }
    ])
  })
})

describe('storeActiveDatasets', () => {
  test('loads locations for datasets and stores them', async () => {
    const apiResult = {
      paging: {
        maxPageSize: 4,
        minPageSize: 1,
        next: 'http://localhost:5000/locations?&page=2&datasetId=wd',
        prev: null,
        totalObjectCount: 1
      },
      results: [
        {
          features: [{ properties: { locationId: 'foo' } }]
        }
      ]
    }
    getFromApi.mockResolvedValue(apiResult)
    const commit = jest.fn()
    const _ids = ['wl']
    const state = {
      datasets: {
        wl: {},
        wd: {}
      },
      activeDatasetIds: [],
      activeLocationIds: []
    }
    const get = {
      knownDatasetIds: ['wl']
    }
    await actions.storeActiveDatasets({ commit, state, getters: get }, _ids)
    expect(commit.mock.calls[0][0]).toBe('setActiveDatasetIds')
    expect(commit.mock.calls[0][1]).toEqual(['wl'])
  })

  test('returns object of known ids of datasets provided as string', async () => {
    const apiResult = {
      paging: {
        maxPageSize: 4,
        minPageSize: 1,
        next: 'http://localhost:5000/locations?&page=2&datasetId=wd',
        prev: null,
        totalObjectCount: 1
      },
      results: [
        {
          features: [{ properties: { locationId: 'foo' } }]
        }
      ]
    }
    getFromApi.mockResolvedValue(apiResult)
    const commit = jest.fn()
    const _ids = 'wl'
    const state = {
      datasets: {
        wl: {},
        wd: {}
      },
      activeDatasetIds: [],
      activeLocationIds: []
    }
    const get = {
      knownDatasetIds: ['wl']
    }
    await actions.storeActiveDatasets({ commit, state, getters: get }, _ids)
    expect(commit.mock.calls[0][0]).toBe('setActiveDatasetIds')
    expect(commit.mock.calls[0][1]).toEqual(['wl'])
    // expect(commit.mock.calls[1][0]).toBe('datasets/addDatasetLocations')
    // expect(commit.mock.calls[1][1]).toEqual({
    //   data: {
    //     features: apiResult.results[0].features,
    //     type: 'FeatureCollection',
    //   },
    //   id: 'wl',
    // })
  })
})

describe('loadPointDataForLocation', () => {
  const state = {
    datasets: {
      par1: {},
      par2: {
        pointData: {
          loc1: {
            foo: 'bar'
          }
        }
      },
      par3: {
        metadata: {
          pointData: 'images'
        }
      }
    }
  }
  test('loads point data for line and scatter plots for the specified location', async () => {
    const commit = jest.fn()
    const timestamp = moment()
    const apiResult = {
      results: [
        {
          events: [
            {
              timestamp,
              value: 1
            }
          ]
        }
      ]
    }
    getFromApi.mockResolvedValue(apiResult)
    await actions.loadPointDataForLocation(
      { commit, state },
      { datasetIds: ['par1', 'par2'], locationId: 'loc1' }
    )
    expect(getFromApi).toHaveBeenCalledWith('timeseries', {
      datasetId: 'par2',
      endTime: moment()
        .add(5, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ'),
      locationId: 'loc1',
      startTime: moment()
        .subtract(3, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ')
    })
    expect(commit.mock.calls[0]).toEqual([
      'datasets/addDatasetPointData',
      {
        id: 'par1',
        data: {
          loc1: {
            category: [moment(timestamp).format()],
            serie: [1]
          }
        }
      }
    ])
    expect(commit.mock.calls[1]).toEqual([
      'datasets/addDatasetPointData',
      {
        data: {
          loc1: {
            category: [moment(timestamp).format()],
            serie: [1]
          }
        },
        id: 'par2'
      }
    ])
  })

  test('loads point data for images plots for the specified location', async () => {
    const commit = jest.fn()
    const apiResult = 'testUrl'

    getFromApi.mockResolvedValue(apiResult)
    await actions.loadPointDataForLocation(
      { commit, state },
      { datasetIds: ['par3'], locationId: 'loc1' }
    )
    expect(getFromApi).toHaveBeenCalledWith('timeseries', {
      datasetId: 'par3',
      endTime: moment()
        .add(5, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ'),
      locationId: 'loc1',
      startTime: moment()
        .subtract(3, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ')
    })

    expect(commit.mock.calls[0]).toEqual([
      'datasets/addDatasetPointData',
      {
        id: 'par3',
        data: {
          loc1: {
            imageUrl: 'testUrl'
          }
        }
      }
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
              value: 1
            }
          ]
        }
      ]
    }
    getFromApi.mockResolvedValue(apiResult)
    await actions.loadPointDataForLocation(
      { commit, state },
      { datasetIds: ['par2'], locationId: 'loc1' }
    )
    expect(getFromApi).toHaveBeenCalledWith('timeseries', {
      datasetId: 'par2',
      endTime: moment()
        .add(5, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ'),
      locationId: 'loc1',
      startTime: moment()
        .subtract(3, 'days')
        .format('YYYY-MM-DDTHH:mm:ssZ')
    })

    expect(commit.mock.calls[0]).toEqual([
      'datasets/addDatasetPointData',
      {
        data: {
          loc1: {
            category: [moment(timestamp).format()],
            serie: [1]
          }
        },
        id: 'par2'
      }
    ])
  })
})
