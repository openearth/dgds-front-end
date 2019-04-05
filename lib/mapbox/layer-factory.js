export default function layerFactory(sourceType, layer) {
  switch (sourceType) {
    case 'geojson':
      return buildGeoJSONLayer(layer)
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

  return { ...layer, source }
}
