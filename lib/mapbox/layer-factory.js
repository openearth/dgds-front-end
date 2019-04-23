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

  return { ...layer, source }
}

function buildRasterLayer(layer) {
  const source = {
    type: 'raster',
    tileSize: 256,
    tiles: [
      'https://tl-ng038.xtr.deltares.nl/thredds/wms/Thredds/yearly/CHL_1km_2009.nc?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=mean_chlorophyll&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&COLORSCALERANGE=0,80&&STYLES=boxfill/msfd&TRANSPARENT=TRUE&',
    ],
  }
  return { ...layer, source }
}
