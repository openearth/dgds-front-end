import curry from 'lodash/fp/curry'
import get from 'lodash/fp/get'

/**
 * Updates the layer source with new data
 *
 * @param {Object} mapbox Mapbox instance
 * @param {Object} layer Layer to update
 */
export default curry(function updateLayerSource(mapbox, layer) {
  const source = mapbox.getSource(layer.id)
  const data = get('source.data', layer)

  if (source && data) {
    source.setData(data)
  } else {
    !source && console.warn(`Source with id ${layer.id} could not be found`) // eslint-disable-line
    !data && console.warn('data property on layer could not be found', layer) // eslint-disable-line
  }
})
