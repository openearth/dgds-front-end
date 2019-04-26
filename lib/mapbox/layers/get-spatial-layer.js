import layerFactory from '../layer-factory'

const baseLayer = {
  id: 'spatial',
  type: 'raster',
  update(mapbox) {
    const source = mapbox.getSource(this.id)
    if (source) {
      mapbox.removeLayer(this.id)
      mapbox.removeSource(this.id)
    }
    if (this.source.tiles.length > 0) {
      mapbox.addLayer(this)
    }
  },
  add(mapbox) {
    if (this.source.tiles.length > 0) {
      mapbox.addLayer(this)
    }
  },
}

export default () => layerFactory('spatial', baseLayer)