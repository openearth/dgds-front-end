import updateLayerSource from '../../../../lib/mapbox/update-layer-source'

test('updates the layer source in the provided mapbox instance', () => {
  const setData = jest.fn()
  const getSource = jest.fn(() => ({ setData }))
  const mapbox = { getSource }
  const layer = {
    id: 'foo',
    source: {
      data: {
        foo: 'bar',
      },
    },
  }

  updateLayerSource(mapbox, layer)

  expect(getSource).toHaveBeenCalledWith(layer.id)
  expect(setData).toHaveBeenCalledWith(layer.source.data)
})

test('can be called curried', () => {
  const setData = jest.fn()
  const getSource = jest.fn(() => ({ setData }))
  const mapbox = { getSource }
  const layer = {
    id: 'foo',
    source: {
      data: {
        foo: 'bar',
      },
    },
  }

  updateLayerSource(mapbox)(layer)

  expect(getSource).toHaveBeenCalledWith(layer.id)
  expect(setData).toHaveBeenCalledWith(layer.source.data)
})
