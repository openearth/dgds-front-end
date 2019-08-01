import getVectorLayer from '../../../../../lib/mapbox/layers/get-vector-layer'
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

test('returns location layer with default paint', () => {
  const locationsLayer = getVectorLayer()
  expect(locationsLayer).toMatchObject({paint: locationsPaint })
})
