import { getCurrentStyle } from './get-style'

export default function addLayer(map) {
  return function addLayerToMap(layer) {
    const styleId = getCurrentStyle(map).id

    const layout = layer.layout[styleId] || layer.layout || {}
    const paint = layer.paint[styleId] || layer.paint || {}

    const styledLayer = { ...layer, paint, layout }

    map.addLayer(styledLayer)
  }
}
