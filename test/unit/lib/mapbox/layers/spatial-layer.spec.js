import getSpatialLayer from '../../../../../lib/mapbox/layers/spatial-layer'

const layer = {
  id: 'spatial',
  type: 'raster',
  source: {
    tileSize: 256,
    tiles: [],
    type: 'raster',
  },
}

test('returns location layer', () => {
  const { id, type, source } = getSpatialLayer()
  expect(id).toEqual(layer.id)
  expect(type).toEqual(layer.type)
  expect(source).toEqual(layer.source)
})

describe('add', () => {
  test('call mapbox.addLayer with a layer containing the correct source structure', () => {
    const mapbox = {
      addLayer: jest.fn(),
    }
    const spatialLayer = getSpatialLayer()
    spatialLayer.source.tiles.push('some/url')
    spatialLayer.add(mapbox)

    expect(mapbox.addLayer.mock.calls[0][0]).toMatchObject({
      id: 'spatial',
      type: 'raster',
      source: {
        tileSize: 256,
        tiles: ['some/url'],
        type: 'raster',
      },
    })
  })
  test('dont add when tiles are empty', () => {
    const mapbox = {
      addLayer: jest.fn(),
    }
    const spatialLayer = getSpatialLayer()
    spatialLayer.add(mapbox)
    expect(mapbox.addLayer).not.toHaveBeenCalled()
  })
})

describe('update', () => {
  test('remove current layer and adds new one', () => {
    const setData = jest.fn()
    const removeLayer = jest.fn()
    const removeSource = jest.fn()
    const addLayer = jest.fn()
    const mapbox = {
      getSource: () => ({
        setData,
      }),
      removeLayer,
      removeSource,
      addLayer,
    }
    const spatialLayer = getSpatialLayer()
    spatialLayer.source.tiles = ['some/url']
    spatialLayer.update(mapbox)
    expect(removeLayer).toHaveBeenCalledWith('spatial')
    expect(removeSource).toHaveBeenCalledWith('spatial')
    expect(addLayer).toHaveBeenCalledWith(spatialLayer)
  })

  test('do not remove layer when its not defined in mapbox', () => {
    const setData = jest.fn()
    const removeLayer = jest.fn()
    const removeSource = jest.fn()
    const addLayer = jest.fn()
    const mapbox = {
      getSource: () => undefined,
      removeLayer,
      removeSource,
      addLayer,
    }
    const spatialLayer = getSpatialLayer()
    spatialLayer.source.tiles = ['some/url']
    spatialLayer.update(mapbox)
    expect(removeLayer).not.toHaveBeenCalledWith('spatial')
    expect(removeSource).not.toHaveBeenCalledWith('spatial')
    expect(addLayer).toHaveBeenCalledWith(spatialLayer)
  })

  test('do not add new layer when tiles are empty', () => {
    const setData = jest.fn()
    const removeLayer = jest.fn()
    const removeSource = jest.fn()
    const addLayer = jest.fn()
    const mapbox = {
      getSource: () => () => ({
        setData,
      }),
      removeLayer,
      removeSource,
      addLayer,
    }
    const spatialLayer = getSpatialLayer()
    spatialLayer.update(mapbox)
    expect(removeLayer).toHaveBeenCalledWith('spatial')
    expect(removeSource).toHaveBeenCalledWith('spatial')
    expect(addLayer).not.toHaveBeenCalledWith(spatialLayer)
  })
})
