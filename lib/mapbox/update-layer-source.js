export default function updateLayerSource(mapbox) {
  return function updateSource(layer) {
    switch (layer.id) {
      case 'locations':
        mapbox.getSource(layer.id).setData(layer.source.data)
        break
      case 'spatial':
        const spatialLayer = mapbox.getSource(layer.id)
        if (spatialLayer) {
          mapbox.removeLayer(layer.id)
          mapbox.removeSource(layer.id)
        }
        if (layer.source.tiles.length > 0) {
          mapbox.addLayer(layer)
        }
    }
  }
}
