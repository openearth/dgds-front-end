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
        { date: '01-02-2021 09:30', href: 'https://www.url.nl'}
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
    const rasterLayer = { date: '01-02-2021 09:30', href: 'https://www.url.nl?min=5&max=6'}
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

describe('triggerActiveVector', () => {
  const dispatch = jest.fn()
  const state = {
    activeDatasetIds: ['id1', 'id2'],
    datasets: {
      id1: 'foo'
    },
    vectorDataCollection: {
      id2: {}
    }
  }

  test('loads vector data if id not yet in vectorDataCollection', () => {
    actions.triggerActiveVector({ state, dispatch })
    expect(dispatch.mock.calls[0]).toEqual([
      'loadVectorLayer', 'foo'
    ])
  })
})

describe('loadVectorLayer', () => {
  const dispatch = jest.fn()
  const state = {
    activeDatasetIds: ['id1', 'id2'],
    datasets: {
      id1: 'foo'
    },
    vectorDataCollection: {
      id2: {}
    }
  }

  test('returns when no dataset is given', () => {
    actions.loadVectorLayer({ state, dispatch })
    expect(dispatch).not.toHaveBeenCalled()
  })

  test('returns when a dataset is given that does nog appear in vectorDataCollection', () => {
    const dataset = {
      id: 'id2'
    }
    actions.loadVectorLayer({ state, dispatch }, dataset)
    expect(dispatch).not.toHaveBeenCalled()
  })

  test('loads vector data if id not yet in vectorDataCollection', () => {
    const dataset = {
      id: 'id1',
      links: [
        { rel: 'child', href: 'child1', title: 'id1-mapbox' }
      ]
    }
    actions.loadVectorLayer({ state, dispatch }, dataset)
    expect(dispatch.mock.calls[0]).toEqual([
      'loadLayerCollection', {collectionUrl: 'child1', setCollectionCommit: 'setVectorData', datasetId: 'id1'}
    ])
  })
})

describe('loadLayerCollection', () => {
  test('fetches datasets and stores them', async () => {
    const commit = jest.fn()
    const apiResult = {
      links: [
        { rel: 'item', href: 'child1', id: 'child1' },
        { rel: 'item', href: 'child2', id: 'child2' }
      ]
    }

    getCatalog.mockResolvedValueOnce(apiResult)
    getCatalog.mockResolvedValue('bar')

    const childs = await actions.loadLayerCollection({ commit }, { collectionUrl: 'url', setCollectionCommit: 'foo', datasetId: 'par1' })
    await childs
    apiResult.layers = ['bar', 'bar']
    expect(commit.mock.calls[0]).toEqual([
      'foo', { id: 'par1', data: apiResult }
    ])
  })
})
