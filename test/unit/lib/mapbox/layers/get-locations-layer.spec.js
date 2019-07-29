import getLocationsLayer from '../../../../../lib/mapbox/layers/get-locations-layer'
import getColors from '../../../../../lib/styling/colors'

const color = getColors('dark')
const locationsPaint = {
  'circle-color': ['case', ['has', 'active'], color.white100, color.pink],
  'circle-stroke-color': [
    'case',
    ['has', 'active'],
    color.blue60,
    color.white100,
  ],
  'circle-stroke-width': ['case', ['has', 'active'], 4, 1],
  'circle-pitch-alignment': 'map',
  'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 4, 22, 8],
  'circle-opacity': 0.8,
  'circle-stroke-opacity': 0.8,
}

const layer = {
  id: 'locations',
  type: 'circle',
  source: {
    type: 'vector',
  },
  paint: locationsPaint,
}

test('returns location layer', () => {
  const locationsLayer = getLocationsLayer()
  expect(locationsLayer).toMatchObject(layer)
})

describe('add', () => {
  test('call mapbox.addLayer with a layer containing the correct paint colors', () => {
    const mapbox = {
      addLayer: jest.fn(),
    }

    const locationsLayer = getLocationsLayer()
    locationsLayer.add(mapbox)

    expect(mapbox.addLayer.mock.calls[0][0]).toMatchObject({
      paint: locationsPaint,
    })
  })

  test('call mapbox.addLayer with a layer containing the correct paint colors when style cant be found', () => {
    const mapbox = {
      addLayer: jest.fn(),
    }

    const locationsLayer = getLocationsLayer()
    locationsLayer.add(mapbox)

    expect(mapbox.addLayer.mock.calls[0][0]).toMatchObject({
      paint: locationsPaint,
    })
  })
})

describe('update', () => {
  test('the current layer with new data', () => {
    const setData = jest.fn()
    const mapbox = {
      getSource: () => ({
        setData,
        data: { foo: 'bar' },
      }),
    }
    const locationsLayer = getLocationsLayer()
    locationsLayer.update(mapbox)
    expect(setData).toHaveBeenCalledWith(mapbox.getSource().data)
  })
  test('does not call setData when mapbox source is not available', () => {
    const setData = jest.fn()
    const mapbox = {
      getSource: () => undefined,
    }
    console.warn = jest.fn() // eslint-disable-line
    const locationsLayer = getLocationsLayer()
    locationsLayer.update(mapbox)
    expect(setData).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalledWith( // eslint-disable-line
      'Source with id locations could not be found',
    )
  })
  test('does not call set data when layer source data is not available', () => {
    const setData = jest.fn()
    const mapbox = {
      getSource: () => ({
        setData,
      }),
    }
    console.warn = jest.fn() // eslint-disable-line
    const locationsLayer = getLocationsLayer()
    locationsLayer.source = undefined
    locationsLayer.update(mapbox)
    expect(setData).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalledWith( // eslint-disable-line
      'data property on layer could not be found',
      locationsLayer,
    )
  })
})
