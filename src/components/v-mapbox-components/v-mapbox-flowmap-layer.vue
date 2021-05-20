<script>
// https://github.com/mapbox/webgl-wind
import * as windGl from '@openearth/windgl'

export default {
  name: 'VMapboxFlowmapLayer',
  props: {
    options: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      layer: null
    }
  },
  mounted () {
    const map = this.getMap()
    if (!map) {
      return
    }
    this.createLayer(map)
  },
  beforeDestroy () {
    // cleanup layer
    const layer = this.layer
    const map = this.getMap()
    if (layer.id && map.getLayer(layer.id)) {
      // this layer does not have a  source
      map.removeLayer(layer.id)
      layer.onRemove(map)
    }
  },
  methods: {
    createLayer (map) {
      // check if already created
      const oldLayer = map.getLayer('particle')
      if (oldLayer) {
        console.warn('layer already created')
        return
      }

      // get the tile source
      const url = _.get(this.options, 'source.tiles[0]')
      console.log(url)
      // the tile.json contains extra information
      const tileUrl = url.replace('{z}/{x}/{y}.png', 'tile.json')
      const source = windGl.source(tileUrl)
      // Add the visualisation layer
      const layerConfig = {
        type: 'particles',
        after: 'waterway-label',
        properties: {
          // Make particles go faster as we reach zoom level 8
          'particle-speed': ['interpolate', ['linear'], ['zoom'], 0, 1.5, 8, 30],
          // Make particles greenish (triad wrt purple) and vary lightness a bit
          'particle-color': [
            'interpolate',
            ['linear'],
            ['get', 'speed'],
            0.0,
            'hsla(154, 60%, 93%, 0.5)',
            0.1,
            'hsla(154, 60%, 53%, 1)',
            1.0,
            'hsla(154, 60%, 20%, 1)'
          ]
        }
      }

      const { type, after, properties } = layerConfig
      const constructor = windGl[type]
      // create a custom layertype
      const layer = constructor(
        Object.assign(
          {
            id: type,
            source
          },
          properties || {}
        )
      )
      layer.maxzoom = 7
      layer.minzoom = 0
      if (after) {
        // add it inline (before the label)
        map.addLayer(layer, after)
      } else {
        map.addLayer(layer)
      }
      // save for removal
      this.layer = layer
    }
  },
  render () {
    return null
  },
  inject: ['getMap']
}
</script>
