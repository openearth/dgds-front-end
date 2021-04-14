import merge from 'lodash/merge'

export default function layerFactory (sourceType, layer) {
  switch (sourceType) {
    case 'geojson':
      return layer
    case 'raster':
      return buildRasterLayer(layer)
  }
}

function buildRasterLayer (layer) {
  const source = {
    type: 'raster',
    tileSize: 256,
    tiles: []
  }
  return merge({ source }, layer)
}
