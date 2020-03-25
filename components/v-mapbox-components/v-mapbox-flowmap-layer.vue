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
    return {}
  },
  mounted () {
  },
  methods: {
    deferredMountedTo (map) {
      // get the tile source, will be replaced byoptions
      const source = windGl.source('glossis/tile.json')
      // Add the visualisation layer
      const layers = [
        {
          type: 'particles',
          after: 'waterway-label',

          properties: {
            'particle-speed': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              0.9,
              8,
              1.5
            ],
            'particle-color': 'rgba(60, 60, 90, 0.9)'
          }
        }
      ]
      layers.forEach((layer) => {
        const { type, after, properties } = layer
        if (windGl[type]) {
          // create a custom layertype
          layer = windGl[type](
            Object.assign(
              {
                id: type,
                source
              },
              properties || {}
            )
          )
        }
        if (after) {
          // add it inline (before the label)
          map.addLayer(layer, after)
        } else {
          map.addLayer(layer)
        }
      })
    }
  },
  render () {
    return null
  },
  inject: ['getMap']
}
</script>
