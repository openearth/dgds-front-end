import updateLayerSource from '../../../../lib/mapbox/update-layer-source'

test('updates the layer source in the provided mapbox instance', () => {
  // TODO: only tests locations now
  const setData = jest.fn()
  const getSource = jest.fn(() => ({ setData }))
  const mapbox = { getSource }
  const layer = {
    id: 'locations',
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
  // TODO: only tests locations now
  const setData = jest.fn()
  const getSource = jest.fn(() => ({ setData }))
  const mapbox = { getSource }
  const layer = {
    id: 'locations',
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
  // TODO: only tests locations now
  const setData = jest.fn()
  const getSource = jest.fn(() => undefined)
  const mapbox = { getSource }
  const layer = {
    id: 'locations',
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
    'Source with id locations could not be found',
  )
})

test('dont call setData when source data is not present on layer', () => {
  // TODO: only tests locations now

  const setData = jest.fn()
  const getSource = jest.fn(() => ({ setData }))
  const mapbox = { getSource }
  const layer = {
    id: 'locations',
    source: {},
  }
  window.console.warn = jest.fn()
  updateLayerSource(mapbox, layer)

  expect(getSource).toHaveBeenCalledWith(layer.id)
  expect(setData).not.toHaveBeenCalled()
  expect(window.console.warn).toHaveBeenCalledWith(
    'data property on layer could not be found',
    { id: 'locations', source: {} },
  )
})
