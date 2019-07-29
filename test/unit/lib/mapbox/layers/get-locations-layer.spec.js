import getLocationsLayer from '../../../../../lib/mapbox/layers/get-locations-layer'
import getColors from '../../../../../lib/styling/colors'

const color = getColors('dark')

const layer = {
  id: 'locations',
  type: 'circle',
  source: {
    type: 'vector',
  },
  paint: {
    'circle-radius': 8,

    // prettier-ignore
    'circle-stroke-width': [
      'case',
      ['has', 'active'], 8,
      4
    ],
    // prettier-ignore
    'circle-color': [
      'case',
      ['has', 'active'], color.white100,
      color.pink,
    ],

    // prettier-ignore
    'circle-stroke-color': [
      'case',
      ['has', 'active'], color.blue60,
      color.black100,
    ],

    // prettier-ignore
    'circle-stroke-opacity': [
      'case',
      ['has', 'active'], 1,
      0.2,
    ]
  },
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
      paint: {
        'circle-color': ['case', ['has', 'active'], '#ffffff', '#ff33dd'],
        'circle-radius': 8,
        'circle-stroke-color': [
          'case',
          ['has', 'active'],
          '#66bbdc',
          '#000000',
        ],
        'circle-stroke-opacity': ['case', ['has', 'active'], 1, 0.2],
        'circle-stroke-width': ['case', ['has', 'active'], 8, 4],
      },
    })
  })

  test('call mapbox.addLayer with a layer containing the correct paint colors when style cant be found', () => {
    const mapbox = {
      addLayer: jest.fn(),
    }

    const locationsLayer = getLocationsLayer()
    locationsLayer.add(mapbox)

    expect(mapbox.addLayer.mock.calls[0][0]).toMatchObject({
      paint: {
        'circle-color': ['case', ['has', 'active'], '#ffffff', '#ff33dd'],
        'circle-radius': 8,
        'circle-stroke-color': [
          'case',
          ['has', 'active'],
          '#66bbdc',
          '#000000',
        ],
        'circle-stroke-opacity': ['case', ['has', 'active'], 1, 0.2],
        'circle-stroke-width': ['case', ['has', 'active'], 8, 4],
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
