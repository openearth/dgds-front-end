import { getCurrentStyle } from './get-style'

export default function addLayer(mapbox) {
  return function addLayerToMap(layer) {
    const styleId = getCurrentStyle(mapbox).id

    const layout = layer.layout[styleId] || layer.layout || {}
    const paint = layer.paint[styleId] || layer.paint || {}

    const styledLayer = { ...layer, paint, layout }

    mapbox.addLayer(styledLayer)
  }
}
