import getColors from '../../styling/colors'

const color = getColors('dark')
const defaultPaint = {
  'circle-color': ['case', ['has', 'active'], color.white100, color.pink],
  'circle-stroke-color': [
    'case',
    ['has', 'active'],
    color.blue60,
    color.white100,
  ],
  'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 5, 0, 12, 2],
  'circle-pitch-alignment': 'map',
  'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 1, 8, 5],
  'circle-opacity': 0.6,
  'circle-stroke-opacity': 0.4,
}

const layer = {
  paint: defaultPaint,
}

export default () => layer
