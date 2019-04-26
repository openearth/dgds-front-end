import merge from 'lodash/merge'

export default function layerFactory(sourceType, layer) {
  switch (sourceType) {
    case 'geojson':
      return buildGeoJSONLayer(layer)
    case 'spatial':
      return buildRasterLayer(layer)
  }
}

function buildGeoJSONLayer(layer) {
  const source = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  }

  return merge({ source }, layer)
}

function buildRasterLayer(layer) {
  const source = {
    type: 'raster',
    tileSize: 256,
    tiles: [],
  }
  return merge({ source }, layer)
}
