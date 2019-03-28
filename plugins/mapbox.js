import Vue from 'vue'
import map from 'lodash/fp/map'
import diff from '../lib/diff-object'
import dispatchEvent from '../lib/dispatch-event'
import loadModule from '../lib/load-module'
import mapAsync from '../lib/map-async'
import updateLayerSource from '../lib/mapbox/update-layer-source'
import pointsLayer from '../lib/mapbox/layers/points-layer'
import { getStyle } from '../lib/mapbox/get-style'
import addLayer from '../lib/mapbox/add-layer'
import addImage from '../lib/mapbox/add-image'
import icons from '../lib/mapbox/icons'

let mapbox
let addLayersToMap
let updateLayerSources
let addIcons

const layers = [pointsLayer]

Vue.directive('mapbox', {
  async bind(container, { value }, vnode) {
    const emitEvent = dispatchEvent(container)
    const style = getStyle({ id: value.style }).get('url')
    const mapboxgl = await loadModule(import('mapbox-gl'))
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    mapbox = new mapboxgl.Map({ container, style })
    mapbox.addControl(new mapboxgl.NavigationControl())

    addIcons = mapAsync(addImage(mapbox))
    addLayersToMap = map(addLayer(mapbox))
    updateLayerSources = map(updateLayerSource(mapbox))

    mapbox.on('load', async () => {
      await addIcons(icons)
      addLayersToMap(layers)
      emitEvent('load')
    })

    mapbox.on('styledataloading', _ =>
      mapbox.once('styledata', async _ => {
        await addIcons(icons)
        addLayersToMap(layers)
      }),
    )
  },

  update(container, { value: newValue, oldValue }) {
    newValue.sources.forEach(source => {
      pointsLayer.source.data.features = [
        ...pointsLayer.source.data.features,
        ...source.features,
      ]
    })

    updateLayerSources(layers)

    const diffed = diff(oldValue, newValue)

    if (diffed && diffed.style) {
      const newStyle = getStyle({ id: newValue.style })
      mapbox.setStyle(newStyle.get('url'))
    }
  },
})
