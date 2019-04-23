export default function updateLayerSource(mapbox) {
  return function updateSource(layer) {
    switch (layer.id) {
      case 'locations':
        mapbox.getSource(layer.id).setData(layer.source.data)
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
