import Vue from 'vue'
import diff from '../lib/diff-object'
import layerFactory from '../lib/mapbox/layer-factory'

let map
const styles = [
  { url: 'mapbox://styles/mapbox/dark-v10', name: 'Mapbox Dark', id: 'dark' },
  {
    url: 'mapbox://styles/mapbox/light-v10',
    name: 'Mapbox Light',
    id: 'light',
  },
]

const getStyle = obj => {
  const entries = Object.entries(obj)
  const style = styles.find(style =>
    entries.map(([key, value]) => style[key] === value).every(value => value),
  )
  return { ...style, get: property => style[property] }
}

const dispatchEvent = el => (event, detail) =>
  el.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }))

const pointsLayer = layerFactory('geojson', {
  id: 'points',
  type: 'circle',
  layout: {},
  paint: {
    dark: {
      'circle-radius': 5,
      'circle-color': '#ff0000',
    },
    light: {
      'circle-radius': 5,
      'circle-color': '#0000ff',
    },
  },
})

function addLayerToMap(map, layer) {
  const { name } = map.getStyle()
  const styleId = getStyle({ name }).get('id')
  const layerWithStyle = { ...layer, paint: layer.paint[styleId] }
  map.addLayer(layerWithStyle)
}

function updateLayerSource(map, layer) {
  map.getSource(layer.id).setData(layer.source.data)
}

Vue.directive('mapbox', {
  async bind(container, { value }, vnode) {
    const emitEvent = dispatchEvent(container)
    const MapboxGLModule = await import('mapbox-gl')
    const mapboxgl = MapboxGLModule.default
    const style = getStyle({ id: value.style }).get('url')

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
      const newStyle = getStyle({ id: newValue.style })
      map.setStyle(newStyle.get('url'))
    }
  },
})
