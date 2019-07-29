import get from 'lodash/fp/get'
import getColors from '../../styling/colors'
import layerFactory from '../layer-factory'
// import { getCurrentStyle } from '../get-style'

const color = getColors('dark')

const baseLayer = {
  id: 'locations',
  type: 'circle',
  paint: {
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
  },
  source: {
    type: 'vector',
    url: 'mapbox://global-data-viewer.6w19mbaw',
  },
  update(mapbox) {
    const source = mapbox.getSource(this.id)
    const data = source ? source.data : undefined
    if (source && data) {
      source.setData(data)
    } else {
      !source && console.warn(`Source with id ${this.id} could not be found`) // eslint-disable-line
      !data && console.warn('data property on layer could not be found', this) // eslint-disable-line
    }
  },
  get(mapbox) {
    const paint = get(`paint`, this)

    const styledLayer = {
      id: this.id,
      type: this.type,
      source: this.source,
      'source-layer': 'pltc012flat',
      paint,
    }
    return styledLayer
  },
  add(mapbox) {
    const styledLayer = this.get(mapbox)
    mapbox.addLayer(styledLayer)
  },
}

export default () => layerFactory('geojson', baseLayer)
