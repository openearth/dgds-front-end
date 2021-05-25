import { actions } from '@/store/map/index.js'
import getCatalog from '@/lib/request/get-catalog'

jest.mock('@/lib/request/get-catalog')

describe('loadDatasets', () => {
  test('fetches datasets and stores them', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const apiResult = {
      summaries: {
        keywords: [{ id: 'theme1', name: 'theme1Name' }]
      },
      links: [
        { rel: 'child', href: 'child1', id: 'child1' },
        { rel: 'child', href: 'child2', id: 'child2' }
      ]
    }
    const state = {
      activeRasterLayerId: 'child1',
      activeDatasetIds: ['child2']
    }
    const dataset = { foo: 'bar', id: 'child1' }
    const dataset2 = { bar: 'foo', id: 'child2' }

    getCatalog.mockResolvedValueOnce(apiResult)
    getCatalog.mockResolvedValueOnce(dataset)
    getCatalog.mockResolvedValueOnce(dataset2)

    const childs = await actions.loadDatasets({ state, commit, dispatch })
    await childs

    expect(commit.mock.calls[0]).toEqual([
      'addTheme',
      { id: 'theme1', name: 'theme1Name' }
    ])

    expect(commit.mock.calls[1]).toEqual([
      'addDataset', dataset
    ])
    expect(commit.mock.calls[2]).toEqual([
      'addDataset', dataset2
    ])
    expect(dispatch.mock.calls[0]).toEqual([
      'loadActiveRasterData', dataset.id
    ])
    expect(dispatch.mock.calls[1]).toEqual([
      'loadVectorLayer', dataset2
    ])
    expect(dispatch.mock.calls[2]).toEqual([
      'triggerActiveVector'
    ])
  })
})

describe('loadActiveRasterData', () => {
  const state = {
    datasets: {
      set1: {
        links: [
          { rel: 'child', href: 'child1', title: 'set1-gee' },
          { rel: 'child', href: 'child2', title: 'set1-flow' }
        ]
      }
    }
  }
  const commit = jest.fn()
  const dispatch = jest.fn()
  test('if null leave empty', () => {
    actions.loadActiveRasterData({ state, commit, dispatch })
    expect(commit.mock.calls[0]).toEqual([
      'setRasterData',
      {}
    ])
  })

  test('store active raster data (gee) and retrieve new data from link ', async () => {
    const dataset = {
      foo: 'bar',
      id: 'child1',
      links: [{
        rel: 'item',
        date: '2021-02-01 08:09:10'
      }]
    }
    getCatalog.mockResolvedValue(dataset)
    await actions.loadActiveRasterData({ state, commit, dispatch }, 'set1')

    expect(commit.mock.calls[1]).toEqual([
      'setRasterData',
      { id: 'set1', data: dataset }
    ])
    expect(dispatch.mock.calls[0]).toEqual([
      'loadActiveRasterLayer', {
        rel: 'item',
        date: '01-02-2021 08:09'
      }
    ])
    expect(commit.mock.calls[2]).toEqual([
      'addActiveFlowmapLayer', dataset
    ])
  })
})

describe('loadActiveRasterLayer', () => {
  const state = {
    activeRasterData: {
      layer: {
        properties: {
          'deltares:min': 0,
          'deltares:max': 1
        }
      },
      links: [
        { date: '01-02-2021 09:30', href: 'http://www.url.nl'}
      ]
    }
  }
  const commit = jest.fn()
  const getters = {
    activeTimestamp: '01-02-2021 09:30'
  }

  const dataset = 'foo'
  test('Use activerasterdata if no rasterlayer is defined', async () => {
    getCatalog.mockResolvedValueOnce(dataset)
    await actions.loadActiveRasterLayer({ state, getters, commit })
    expect(commit.mock.calls[0]).toEqual([
      'addActiveRasterLayer', { data: dataset }
    ])
  })

  test('LoadActiveRasterLayer if  rasterlayer is defined', async () => {
    getCatalog.mockResolvedValueOnce(dataset)
    const rasterLayer = { date: '01-02-2021 09:30', href: 'http://www.url.nl?min=5&max=6'}
    await actions.loadActiveRasterLayer({ state, getters, commit }, rasterLayer)
    expect(commit.mock.calls[0]).toEqual([
      'addActiveRasterLayer', { data: dataset }
    ])
  })
})

describe('storeActiveVectorIds', () => {
  const commit = jest.fn()
  const _ids = 'id1,id2'

  test('Set setActiveDatasetIds from array of ids', () => {
    actions.storeActiveVectorIds({ commit }, _ids)
    expect(commit.mock.calls[0]).toEqual([
      'setActiveDatasetIds', ['id1', 'id2']
    ])
  })
})
// OLD
// describe('storeActiveDatasets', () => {
//   test('loads locations for datasets and stores them', async () => {
//     const apiResult = {
//       paging: {
//         maxPageSize: 4,
//         minPageSize: 1,
//         next: 'http://localhost:5000/locations?&page=2&datasetId=wd',
//         prev: null,
//         totalObjectCount: 1
//       },
//       results: [
//         {
//           features: [{ properties: { locationId: 'foo' } }]
//         }
//       ]
//     }
//     getFromApi.mockResolvedValue(apiResult)
//     const commit = jest.fn()
//     const _ids = ['wl']
//     const state = {
//       datasets: {
//         wl: {},
//         wd: {}
//       },
//       activeDatasetIds: [],
//       activeLocationIds: []
//     }
//     const get = {
//       knownDatasetIds: ['wl']
//     }
//     await actions.storeActiveDatasets({ commit, state, getters: get }, _ids)
//     expect(commit.mock.calls[0][0]).toBe('setActiveDatasetIds')
//     expect(commit.mock.calls[0][1]).toEqual(['wl'])
//   })

//   test('returns object of known ids of datasets provided as string', async () => {
//     const apiResult = {
//       paging: {
//         maxPageSize: 4,
//         minPageSize: 1,
//         next: 'http://localhost:5000/locations?&page=2&datasetId=wd',
//         prev: null,
//         totalObjectCount: 1
//       },
//       results: [
//         {
//           features: [{ properties: { locationId: 'foo' } }]
//         }
//       ]
//     }
//     getFromApi.mockResolvedValue(apiResult)
//     const commit = jest.fn()
//     const _ids = 'wl'
//     const state = {
//       datasets: {
//         wl: {},
//         wd: {}
//       },
//       activeDatasetIds: [],
//       activeLocationIds: []
//     }
//     const get = {
//       knownDatasetIds: ['wl']
//     }
//     await actions.storeActiveDatasets({ commit, state, getters: get }, _ids)
//     expect(commit.mock.calls[0][0]).toBe('setActiveDatasetIds')
//     expect(commit.mock.calls[0][1]).toEqual(['wl'])
//     // expect(commit.mock.calls[1][0]).toBe('datasets/addDatasetLocations')
//     // expect(commit.mock.calls[1][1]).toEqual({
//     //   data: {
//     //     features: apiResult.results[0].features,
//     //     type: 'FeatureCollection',
//     //   },
//     //   id: 'wl',
//     // })
//   })
// })

// describe('loadPointDataForLocation', () => {
//   const state = {
//     datasets: {
//       par1: {},
//       par2: {
//         pointData: {
//           loc1: {
//             foo: 'bar'
//           }
//         }
//       },
//       par3: {
//         metadata: {
//           pointData: 'images'
//         }
//       }
//     }
//   }
//   test('loads point data for line and scatter plots for the specified location', async () => {
//     const commit = jest.fn()
//     const timestamp = moment()
//     const apiResult = {
//       results: [
//         {
//           events: [
//             {
//               timestamp,
//               value: 1
//             }
//           ]
//         }
//       ]
//     }
//     getFromApi.mockResolvedValue(apiResult)
//     await actions.loadPointDataForLocation(
//       { commit, state },
//       { datasetIds: ['par1', 'par2'], locationId: 'loc1' }
//     )
//     expect(getFromApi).toHaveBeenCalledWith('timeseries', {
//       datasetId: 'par2',
//       endTime: moment()
//         .add(5, 'days')
//         .format('YYYY-MM-DDTHH:mm:ssZ'),
//       locationId: 'loc1',
//       startTime: moment()
//         .subtract(5, 'days')
//         .format('YYYY-MM-DDTHH:mm:ssZ')
//     })
//     expect(commit.mock.calls[0]).toEqual([
//       'addDatasetPointData',
//       {
//         id: 'par1',
//         data: {
//           loc1: {
//             category: [moment(timestamp).format()],
//             serie: [1]
//           }
//         }
//       }
//     ])
//     expect(commit.mock.calls[1]).toEqual([
//       'addDatasetPointData',
//       {
//         data: {
//           loc1: {
//             category: [moment(timestamp).format()],
//             serie: [1]
//           }
//         },
//         id: 'par2'
//       }
//     ])
//   })

//   test('loads point data for images plots for the specified location', async () => {
//     const commit = jest.fn()
//     const apiResult = 'testUrl'

//     getFromApi.mockResolvedValue(apiResult)
//     await actions.loadPointDataForLocation(
//       { commit, state },
//       { datasetIds: ['par3'], locationId: 'loc1' }
//     )
//     expect(getFromApi).toHaveBeenCalledWith('timeseries', {
//       datasetId: 'par3',
//       endTime: moment()
//         .add(5, 'days')
//         .format('YYYY-MM-DDTHH:mm:ssZ'),
//       locationId: 'loc1',
//       startTime: moment()
//         .subtract(5, 'days')
//         .format('YYYY-MM-DDTHH:mm:ssZ')
//     })

//     expect(commit.mock.calls[0]).toEqual([
//       'addDatasetPointData',
//       {
//         id: 'par3',
//         data: {
//           loc1: {
//             imageUrl: 'testUrl'
//           }
//         }
//       }
//     ])
//   })

//   test('loads point data for the specified location in string format', async () => {
//     const commit = jest.fn()
//     const timestamp = moment()
//     const apiResult = {
//       results: [
//         {
//           events: [
//             {
//               timestamp,
//               value: 1
//             }
//           ]
//         }
//       ]
//     }
//     getFromApi.mockResolvedValue(apiResult)
//     await actions.loadPointDataForLocation(
//       { commit, state },
//       { datasetIds: ['par2'], locationId: 'loc1' }
//     )
//     expect(getFromApi).toHaveBeenCalledWith('timeseries', {
//       datasetId: 'par2',
//       endTime: moment()
//         .add(5, 'days')
//         .format('YYYY-MM-DDTHH:mm:ssZ'),
//       locationId: 'loc1',
//       startTime: moment()
//         .subtract(5, 'days')
//         .format('YYYY-MM-DDTHH:mm:ssZ')
//     })

//     expect(commit.mock.calls[0]).toEqual([
//       'addDatasetPointData',
//       {
//         data: {
//           loc1: {
//             category: [moment(timestamp).format()],
//             serie: [1]
//           }
//         },
//         id: 'par2'
//       }
//     ])
//   })
// })
