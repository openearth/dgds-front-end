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

test('dont call setData when source is not found', () => {
  const setData = jest.fn()
  const getSource = jest.fn(() => undefined)
  const mapbox = { getSource }
  const layer = {
    id: 'foo',
    source: {
      data: {
        foo: 'bar',
      },
    },
  }
  window.console.warn = jest.fn()
  updateLayerSource(mapbox, layer)

  expect(getSource).toHaveBeenCalledWith(layer.id)
  expect(setData).not.toHaveBeenCalled()
  expect(window.console.warn).toHaveBeenCalledWith(
    'Source with id foo could not be found',
  )
})

test('dont call setData when source data is not present on layer', () => {
  const setData = jest.fn()
  const getSource = jest.fn(() => ({ setData }))
  const mapbox = { getSource }
  const layer = {
    id: 'foo',
    source: {},
  }
  window.console.warn = jest.fn()
  updateLayerSource(mapbox, layer)

  expect(getSource).toHaveBeenCalledWith(layer.id)
  expect(setData).not.toHaveBeenCalled()
  expect(window.console.warn).toHaveBeenCalledWith(
    'data property on layer could not be found',
    { id: 'foo', source: {} },
  )
})
