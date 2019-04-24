export default function updateLayerSource(mapbox) {
  return function updateSource(layer) {
    switch (layer.id) {
      case 'locations':
        mapbox.getSource(layer.id).setData(layer.source.data)
        break
      case 'spatial':
        const spatialLayer = mapbox.getSource(layer.id)
        if (spatialLayer) {
          spatialLayer.tiles = layer.wmsUrl
        }
    }
  }
}
