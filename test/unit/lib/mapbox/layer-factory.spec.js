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
