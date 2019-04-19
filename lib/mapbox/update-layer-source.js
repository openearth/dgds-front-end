import curry from 'lodash/fp/curry'

/**
 * Updates the layer source with new data
 *
 * @param {Object} mapbox Mapbox instance
 * @param {Object} layer Layer to update
 */
export default curry(function updateLayerSource(mapbox, layer) {
  mapbox.getSource(layer.id).setData(layer.source.data)
})
