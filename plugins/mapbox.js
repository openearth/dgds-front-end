import Vue from 'vue'
import map from 'lodash/fp/map'
import has from 'lodash/fp/has'
import diff from '../lib/diff-object'
import dispatchEvent from '../lib/dispatch-event'
import loadModule from '../lib/load-module'
import getLocationsLayer from '../lib/mapbox/layers/get-locations-layer'
import getSpatialLayer from '../lib/mapbox/layers/get-spatial-layer'
import { getUrlFromStyleWhere } from '../lib/mapbox/get-style'

let mapbox
let addLayersToMap
let updateLayerSources
let mapboxLoaded = false

const locationsLayer = getLocationsLayer()
const spatialLayer = getSpatialLayer()

const layers = [locationsLayer, spatialLayer]

Vue.directive('mapbox', {
  async bind(container, args, vnode) {
    const emitEvent = dispatchEvent(container)
    const styleUrl = getUrlFromStyleWhere({ id: args.value.style })
    const mapboxgl = await loadModule(import('mapbox-gl'))
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    mapbox = new mapboxgl.Map({ container, style: styleUrl })
    mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    addLayersToMap = map(layer => layer.add(mapbox))
    updateLayerSources = map(layer => layer.update(mapbox))

    mapbox.on('load', () => {
      addLayersToMap(layers)
      emitEvent('load')
      mapboxLoaded = true
    })

    mapbox.on('click', 'locations', event => {
      const { clientWidth } = mapbox.getCanvas()

      // prettier-ignore
      // the timeseries panel is max 600px wide otherwise the half of the screen
      const visibleMapWidth = clientWidth > 1200
        ? (clientWidth - 600) * 0.25
        : (clientWidth / 2) * 0.5
      const targetLocation = mapbox.unproject({
        x: event.point.x - visibleMapWidth,
        y: event.point.y,
      })
      const duration = 500
      const features = event.features
      mapbox.panTo(targetLocation, { duration })
      emitEvent('load-locations', features)
      setTimeout(() => emitEvent('select-locations', features), duration)
    })

    mapbox.on('mouseenter', 'locations', function() {
      mapbox.getCanvas().style.cursor = 'pointer'
    })

    mapbox.on('mouseleave', 'locations', function() {
      mapbox.getCanvas().style.cursor = ''
    })

    mapbox.on('styledataloading', _ =>
      mapbox.once('styledata', _ => {
        addLayersToMap(layers)
      }),
    )
  },

  update(container, { value: newValue, oldValue }) {
    const changed = diff(oldValue, newValue)
    const styleIn = has('style')

    if (newValue.sources.length) {
      newValue.sources.forEach(source => {
        locationsLayer.source.data.features = source.features
      })
    } else {
      locationsLayer.source.data.features = []
    }

    if (newValue.tiles.length) {
      spatialLayer.source.tiles = [newValue.tiles]
    } else {
      spatialLayer.source.tiles = []
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
