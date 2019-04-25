import locationsLayer from '../../../../../lib/mapbox/layers/locations-layer'
import getColors from '../../../../../lib/styling/colors'
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
}

test('returns location layer', () => {
  const result = locationsLayer
  expect(result).toEqual(layer)
})
