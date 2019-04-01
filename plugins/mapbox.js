import Vue from 'vue'
import map from 'lodash/fp/map'
import has from 'lodash/fp/has'
import diff from '../lib/diff-object'
import dispatchEvent from '../lib/dispatch-event'
import loadModule from '../lib/load-module'
import mapAsync from '../lib/map-async'
import updateLayerSource from '../lib/mapbox/update-layer-source'
import pointsLayer from '../lib/mapbox/layers/points-layer'
import { getUrlFromStyleWhere } from '../lib/mapbox/get-style'
import addLayer from '../lib/mapbox/add-layer'
import addImage from '../lib/mapbox/add-image'
import icons from '../lib/mapbox/icons'

let mapbox
let addLayersToMap
let updateLayerSources
let addIcons
let mapboxLoaded = false

const layers = [pointsLayer]

Vue.directive('mapbox', {
  async bind(container, args, vnode) {
    const emitEvent = dispatchEvent(container)
    const styleUrl = getUrlFromStyleWhere({ id: args.value.style })
    const mapboxgl = await loadModule(import('mapbox-gl'))
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    mapbox = new mapboxgl.Map({ container, style: styleUrl })
    mapbox.addControl(new mapboxgl.NavigationControl())

    addIcons = mapAsync(addImage(mapbox))
    addLayersToMap = map(addLayer(mapbox))
    updateLayerSources = map(updateLayerSource(mapbox))

    mapbox.on('load', async () => {
      await addIcons(icons)
      addLayersToMap(layers)
      emitEvent('load')
      mapboxLoaded = true
    })

    mapbox.on('styledataloading', _ =>
      mapbox.once('styledata', _ => {
        addIcons(icons)
        addLayersToMap(layers)
      }),
    )
  },

  update(container, { value: newValue, oldValue }) {
    const changed = diff(oldValue, newValue)
    const styleIn = has('style')

    if (newValue.sources.length) {
      newValue.sources.forEach(source => {
        pointsLayer.source.data.features = source.features
      })
    } else {
      pointsLayer.source.data.features = []
    }

    if (mapboxLoaded) {
      updateLayerSources(layers)

      if (styleIn(changed)) {
        const url = getUrlFromStyleWhere({ id: newValue.style })
        mapbox.setStyle(url)
      }
    }
  },
})
