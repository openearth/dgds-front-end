export function decorateLayerStyling(layerData) {
  if (
    layerData.properties['deltares:source-layer'] &&
    layerData.properties['deltares:type'] === 'circle'
  ) {
    const style = process.env.VUE_APP_MAPBOX_LAYERS_STYLE || ''
    const token = process.env.VUE_APP_MAPBOX_TOKEN || ''
    const target = layerData.properties['deltares:source-layer'] || ''

    if (style && token && target) {
      const url = `https://api.mapbox.com/styles/v1/${style}?access_token=${token}`

      return fetch(url)
        .then(response => response.json())
        .then(data => {
          const { layers = [] } = data
          const lookup = layers.find(l => l.id === target)

          if (lookup) {
            layerData.properties['deltares:paint'] = lookup.paint
          }

          return layerData
        })
        .catch(e => {
          console.error(e)

          return layerData
        })
    }
  }

  return Promise.resolve(layerData)
}
