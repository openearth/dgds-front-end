import get from 'lodash/fp/get'
import getColors from '../../styling/colors'
import layerFactory from '../layer-factory'
import { getCurrentStyle } from '../get-style'

const light = getColors('light')
const dark = getColors('dark')

const baseLayer = {
  id: 'locations',
  type: 'circle',
  paint: {
    default: {
      'circle-radius': 8,

      // prettier-ignore
      'circle-stroke-width': [
        'case',
        ['has', 'active'], 8,
        4
      ]
    },
    dark: {
      // prettier-ignore
      'circle-color': [
        'case',
        ['has', 'active'], dark.white100,
        dark.pink,
      ],

      // prettier-ignore
      'circle-stroke-color': [
        'case',
        ['has', 'active'], dark.blue60,
        dark.black100,
      ],

      // prettier-ignore
      'circle-stroke-opacity': [
        'case',
        ['has', 'active'], 1,
        0.2,
      ]
    },
    light: {
      // prettier-ignore
      'circle-color': [
        'case',
        ['has', 'active'], light.white100,
        light.pink,
      ],

      // prettier-ignore
      'circle-stroke-color': [
        'case',
        ['has', 'active'], light.blue60,
        light.white100,
      ],

      // prettier-ignore
      'circle-stroke-opacity': [
        'case',
        ['has', 'active'], 1,
        0.6
      ]
    },
  },
  source: {
    type: 'vector',
    url: 'mapbox://global-data-viewer.6w19mbaw',
  },
  update(mapbox) {
    const source = mapbox.getSource(this.id)
    const data = get('source.data', this)

    if (source && data) {
      source.setData(data)
    } else {
      !source && console.warn(`Source with id ${this.id} could not be found`) // eslint-disable-line
      !data && console.warn('data property on layer could not be found', this) // eslint-disable-line
    }
  },
  get(mapbox) {
    const styleId = getCurrentStyle(mapbox).id
    const defaultPaint = get('paint.default', this)
    const paint = get(`paint[${styleId}]`, this)

    const styledLayer = {
      id: this.id,
      type: this.type,
      source: this.source,
      'source-layer': 'pltc012flat',
      paint: { ...defaultPaint, ...paint },
    }
    return styledLayer
  },
  add(mapbox) {
    const styledLayer = this.get(mapbox)
    mapbox.addLayer(styledLayer)
  },
}

export default () => layerFactory('geojson', baseLayer)
