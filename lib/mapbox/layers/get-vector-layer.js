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
  'circle-stroke-width': ['case', ['has', 'active'], 4, 1],
  'circle-pitch-alignment': 'map',
  'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 4, 22, 8],
  'circle-opacity': 0.8,
  'circle-stroke-opacity': 0.8,
}

const layer = {
  paint: defaultPaint,
}

export default () => layer
