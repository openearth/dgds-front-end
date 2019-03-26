import Vue from 'vue'
import diff from '../lib/diff-object'
import layerFactory from '../lib/mapbox/layer-factory'

let map
const styles = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v10',
}
const dispatchEvent = el => (event, detail) =>
  el.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }))

const pointsLayer = layerFactory('geojson', {
  id: 'points',
  type: 'circle',
  layout: {},
  paint: {
    'circle-radius': 5,
    'circle-color': '#ff0000',
  },
})

function addLayerToMap(map, layer) {
  map.addLayer(layer)
}

function updateLayerSource(map, layer) {
  map.getSource(layer.id).setData(layer.source.data)
}

Vue.directive('mapbox', {
  async bind(container, { value }, vnode) {
    const emitEvent = dispatchEvent(container)
    const MapboxGLModule = await import('mapbox-gl')
    const mapboxgl = MapboxGLModule.default
    const style = styles[value.style]

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    map = new mapboxgl.Map({ container, style })

    map.addControl(new mapboxgl.NavigationControl())
    map.on('load', () => {
      addLayerToMap(map, pointsLayer)
      emitEvent('load')
    })
    map.on('styledataloading', _ =>
      map.once('styledata', _ => {
        addLayerToMap(map, pointsLayer)
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

    updateLayerSource(map, pointsLayer)

    const diffed = diff(oldValue, newValue)

    if (diffed && diffed.style) {
      map.setStyle(styles[newValue.style])
    }
  },
})
