export default function updateLayerSource(mapbox) {
  return function updateSource(layer) {
    mapbox.getSource(layer.id).setData(layer.source.data)
  }
}
