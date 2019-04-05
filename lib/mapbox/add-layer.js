import get from 'lodash/fp/get'
import { getCurrentStyle } from './get-style'

export default function addLayer(mapbox) {
  return function addLayerToMap(layer) {
    const styleId = getCurrentStyle(mapbox).id
    const defaultLayout = get(`layout.default`, layer) || {}
    const layout = get(`layout[${styleId}]`, layer) || {}
    const defaultPaint = get(`paint.default`, layer) || {}
    const paint = get(`paint[${styleId}]`, layer) || {}

    const styledLayer = {
      ...layer,
      paint: { ...defaultPaint, ...paint },
      layout: { ...defaultLayout, ...layout },
    }

    mapbox.addLayer(styledLayer)
  }
}
