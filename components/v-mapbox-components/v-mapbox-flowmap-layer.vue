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
      type: Object,
    },
  },
  data() {
    return {
      layer: null,
    }
  },
  mounted() {
    const map = this.getMap()
    if (!map) {
      return
    }
    this.createLayer(map)
  },
  methods: {
    deferredMountedTo(map) {
      this.createLayer(map)
    },
    createLayer(map) {
      // get the tile source, will be replaced byoptions
      const source = windGl.source('https://storage.cloud.google.com/dgds-data/flowmap_glossis/tiles/glossis-current-202003310000/tile.json')
      // Add the visualisation layer
      const layerConfig = {
          type: 'particles',
          after: 'waterway-label',
          properties: {
            'particle-speed': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 8, 1.5],
            'particle-color': 'rgba(60, 60, 90, 0.9)',
          },
        }

        const { type, after, properties } = layerConfig
        const constructor = windGl[type]
        // create a custom layertype
        const layer = constructor(
          Object.assign(
            {
              id: type,
              source,
            },
            properties || {},
          ),
        )
        layer.maxzoom = 7
        layer.minzoom = 1
        if (after) {
          // add it inline (before the label)
          map.addLayer(layer, after)
        } else {
          map.addLayer(layer)
        }
        // save for removal
        this.layer = layer
      },
      beforeDestroy() {
        const layer = this.layer
        if (layer.id && this.map.getLayer(layer.id)) {
          // this layer does not have a  source
          this.map.removeLayer(layer.id)
          this.map.removeSource(layer.source.id)
        }
      },
    },
    render() {
      return null
    },
    inject: ['getMap'],
  }
</script>
