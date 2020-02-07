import getRasterLayer from '../../../../../lib/mapbox/layers/get-raster-layer'

const layer = {
  id: 'raster',
  type: 'raster',
  source: {
    tileSize: 256,
    tiles: [],
    type: 'raster'
  }
}

test('returns location layer', () => {
  const { id, type, source } = getRasterLayer()
  expect(id).toEqual(layer.id)
  expect(type).toEqual(layer.type)
  expect(source).toEqual(layer.source)
})

describe('add', () => {
  test('call mapbox.addLayer with a layer containing the correct source structure', () => {
    const mapbox = {
      addLayer: jest.fn()
    }
    const rasterLayer = getRasterLayer()
    rasterLayer.source.tiles.push('some/url')
    rasterLayer.add(mapbox)

    expect(mapbox.addLayer.mock.calls[0][0]).toMatchObject({
      id: 'raster',
      type: 'raster',
      source: {
        tileSize: 256,
        tiles: ['some/url'],
        type: 'raster'
      }
    })
    expect(mapbox.addLayer.mock.calls[0][1]).toBe('water-border')
  })
  test('dont add when tiles are empty', () => {
    const mapbox = {
      addLayer: jest.fn()
    }
    const rasterLayer = getRasterLayer()
    rasterLayer.add(mapbox)
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
        setData
      }),
      removeLayer,
      removeSource,
      addLayer
    }
    const rasterLayer = getRasterLayer()
    rasterLayer.source.tiles = ['some/url']
    rasterLayer.update(mapbox)
    expect(removeLayer).toHaveBeenCalledWith('raster')
    expect(removeSource).toHaveBeenCalledWith('raster')
    expect(addLayer).toHaveBeenCalledWith(rasterLayer, 'water-border')
  })

  test('do not remove layer when its not defined in mapbox', () => {
    const removeLayer = jest.fn()
    const removeSource = jest.fn()
    const addLayer = jest.fn()
    const mapbox = {
      getSource: () => undefined,
      removeLayer,
      removeSource,
      addLayer
    }
    const rasterLayer = getRasterLayer()
    rasterLayer.source.tiles = ['some/url']
    rasterLayer.update(mapbox)
    expect(removeLayer).not.toHaveBeenCalledWith('raster')
    expect(removeSource).not.toHaveBeenCalledWith('raster')
    expect(addLayer).toHaveBeenCalledWith(rasterLayer, 'water-border')
  })

  test('do not add new layer when tiles are empty', () => {
    const setData = jest.fn()
    const removeLayer = jest.fn()
    const removeSource = jest.fn()
    const addLayer = jest.fn()
    const mapbox = {
      getSource: () => () => ({
        setData
      }),
      removeLayer,
      removeSource,
      addLayer
    }
    const rasterLayer = getRasterLayer()
    rasterLayer.update(mapbox)
    expect(removeLayer).toHaveBeenCalledWith('raster')
    expect(removeSource).toHaveBeenCalledWith('raster')
    expect(addLayer).not.toHaveBeenCalledWith(rasterLayer)
  })
})
