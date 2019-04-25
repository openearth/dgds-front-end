import get from 'lodash/fp/get'
import curry from 'lodash/fp/curry'
import { getCurrentStyle } from './get-style'

/**
 * Adds the layer to the provided mapbox instance with the correct layout and
 * paint properties based on the mapbox instances style
 */
export default curry(function addLayer(mapbox, layer) {
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
        mapbox.addLayer(spatialLayer, 'water-border')
      }
  }
})
