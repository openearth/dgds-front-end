import get from 'lodash/fp/get'
import { getCurrentStyle } from './get-style'

export default function addLayer(mapbox) {
  return function addLayerToMap(layer) {
    switch (layer.id) {
      case 'locations':
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
        break
      case 'spatial':
        if (layer.source.tiles.length > 0) {
          const spatialLayer = {
            ...layer,
          }
          mapbox.addLayer(spatialLayer)
        }
    }
  }
}
