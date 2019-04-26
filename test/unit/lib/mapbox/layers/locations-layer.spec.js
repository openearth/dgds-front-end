import locationsLayer from '../../../../../lib/mapbox/layers/locations-layer'
import getColors from '../../../../../lib/styling/colors'
import { getCurrentStyle } from '../../../../../lib/mapbox/get-style'
jest.mock('../../../../../lib/mapbox/get-style')
getCurrentStyle.mockReturnValue({ id: 'dark' })

const light = getColors('light')
const dark = getColors('dark')

const layer = {
  id: 'locations',
  type: 'circle',
  source: {
    data: {
      features: [],
      type: 'FeatureCollection',
    },
    type: 'geojson',
  },
  paint: {
    default: {
      'circle-radius': 8,

      // prettier-ignore
      'circle-stroke-width': [
        'case',
        ['get', 'active'], 8,
        4
      ]
    },
    dark: {
      // prettier-ignore
      'circle-color': [
        'case',
        ['get', 'active'], dark.white100,
        dark.pink,
      ],

      // prettier-ignore
      'circle-stroke-color': [
        'case',
        ['get', 'active'], dark.blue60,
        dark.black100,
      ],

      // prettier-ignore
      'circle-stroke-opacity': [
        'case',
        ['get', 'active'], 1,
        0.2,
      ]
    },
    light: {
      // prettier-ignore
      'circle-color': [
        'case',
        ['get', 'active'], light.white100,
        light.pink,
      ],

      // prettier-ignore
      'circle-stroke-color': [
        'case',
        ['get', 'active'], light.blue60,
        light.white100,
      ],

      // prettier-ignore
      'circle-stroke-opacity': [
        'case',
        ['get', 'active'], 1,
        0.6
      ]
    },
  },
  add: locationsLayer.add,
  update: locationsLayer.update,
}

test('returns location layer', () => {
  const result = locationsLayer
  expect(result).toEqual(layer)
})

describe('add', () => {
  test('call mapbox.addLayer with a layer containing the correct paint colors', () => {
    const mapbox = {
      addLayer: jest.fn(),
    }

    locationsLayer.add(mapbox)

    expect(mapbox.addLayer.mock.calls[0][0]).toMatchObject({
      paint: {
        'circle-color': ['case', ['get', 'active'], '#ffffff', '#ff33dd'],
        'circle-radius': 8,
        'circle-stroke-color': [
          'case',
          ['get', 'active'],
          '#66bbdc',
          '#000000',
        ],
        'circle-stroke-opacity': ['case', ['get', 'active'], 1, 0.2],
        'circle-stroke-width': ['case', ['get', 'active'], 8, 4],
      },
    })
  })

  test('call mapbox.addLayer with a layer containing the correct paint colors when style cant be found', () => {
    // TODO: only tests locations now

    const mapbox = {
      addLayer: jest.fn(),
    }

    const layer = {
      id: 'locations',
      foo: 'bar',
      layout: {
        light: { id: 'light' },
      },
      paint: {
        light: { id: 'light' },
      },
    }

    locationsLayer.add(mapbox)

    expect(mapbox.addLayer.mock.calls[0][0]).toMatchObject({
      paint: {
        'circle-color': ['case', ['get', 'active'], '#ffffff', '#ff33dd'],
        'circle-radius': 8,
        'circle-stroke-color': [
          'case',
          ['get', 'active'],
          '#66bbdc',
          '#000000',
        ],
        'circle-stroke-opacity': ['case', ['get', 'active'], 1, 0.2],
        'circle-stroke-width': ['case', ['get', 'active'], 8, 4],
      },
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
    locationsLayer.update(mapbox)
    expect(setData).toHaveBeenCalledWith(layer.source.data)
  })
  test('does not call set data when mabox source is not available', () => {
    const setData = jest.fn()
    const mapbox = {
      getSource: () => undefined,
    }
    console.warn = jest.fn()
    locationsLayer.update(mapbox)
    expect(setData).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalledWith(
      'Source with id locations could not be found',
    )
  })
  test('does not call set data when layer source data is not available', () => {
    const setData = jest.fn()
    const mapbox = {
      getSource: () => ({
        setData,
        data: { foo: 'bar' },
      }),
    }
    console.warn = jest.fn()
    locationsLayer.source = undefined
    locationsLayer.update(mapbox)
    expect(setData).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalledWith(
      'data property on layer could not be found',
      locationsLayer,
    )
  })
})
