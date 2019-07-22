import layerFactory from '../../../../lib/mapbox/layer-factory'

describe('geojson', () => {
  test('add geojson data structure to provided layer object', () => {
    const layer = {
      foo: 'bar',
    }
    const result = layerFactory('geojson', layer)

    expect(result).toEqual({
      foo: 'bar',
      source: {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      },
    })
  })

  test('Keep existing geojson on layer', () => {
    const layer = {
      foo: 'bar',
      source: {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [{ foo: 'bar' }] },
      },
    }
    const result = layerFactory('geojson', layer)

    expect(result).toEqual({
      foo: 'bar',
      source: {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [{ foo: 'bar' }] },
      },
    })
  })
})

describe('spatial', () => {
  test('add spatial data structure to provided layer object', () => {
    const layer = {
      foo: 'bar',
    }
    const result = layerFactory('spatial', layer)

    expect(result).toEqual({
      foo: 'bar',
      source: {
        type: 'raster',
        tileSize: 256,
        tiles: [],
      },
    })
  })

  test('Keep existing source data on layer', () => {
    const layer = {
      foo: 'bar',
      source: {
        type: 'raster',
        tileSize: 512,
        tiles: ['path/to/tile'],
      },
    }
    const result = layerFactory('spatial', layer)

    expect(result).toEqual({
      foo: 'bar',
      source: {
        type: 'raster',
        tileSize: 512,
        tiles: ['path/to/tile'],
      },
    })
  })
})
