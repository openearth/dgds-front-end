import Vue from 'vue'
import diff from '../lib/diff-object'
import dispatchEvent from '../lib/dispatch-event'
import loadModule from '../lib/load-module'
import mapAsync from '../lib/map-async'
import pointsLayer from '../lib/mapbox/layers/points-layer'
import { getStyle } from '../lib/mapbox/get-style'
import addLayer from '../lib/mapbox/add-layer'
import addImage from '../lib/mapbox/add-image'
import icons from '../lib/mapbox/icons'

let map

const eachLayer = fn => [pointsLayer].forEach(fn)
const eachIcon = mapAsync(icons)

const updateLayerSource = map => layer => {
  map.getSource(layer.id).setData(layer.source.data)
}

Vue.directive('mapbox', {
  async bind(container, { value }, vnode) {
    const emitEvent = dispatchEvent(container)
    const style = getStyle({ id: value.style }).get('url')
    const mapboxgl = await loadModule(import('mapbox-gl'))
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    map = new mapboxgl.Map({ container, style })
    map.addControl(new mapboxgl.NavigationControl())

    map.on('load', async () => {
      await eachIcon(addImage(map))
      eachLayer(addLayer(map))
      emitEvent('load')
    })

    map.on('styledataloading', _ =>
      map.once('styledata', async _ => {
        await eachIcon(addImage(map))
        eachLayer(addLayer(map))
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

    eachLayer(updateLayerSource(map))

    const diffed = diff(oldValue, newValue)

    if (diffed && diffed.style) {
      const newStyle = getStyle({ id: newValue.style })
      map.setStyle(newStyle.get('url'))
    }
  },
})
