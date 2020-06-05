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
    beforeDestroy() {
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
      createLayer(map) {
        // check if already created
        const oldLayer = map.getLayer('particle')
        if (oldLayer) {
          console.warn('layer already created')
          return
        }

        // get the tile source, will be replaced by options once  backend is fully  implemented
        let url =
          'https://storage.googleapis.com/dgds-data-public/flowmap/glossis/tiles/glossis-current-202003310000/tile.json'
        url = 'glossis/tile.json'
        const source = windGl.source(url)
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
    },
    render() {
      return null
    },
    inject: ['getMap'],
  }
</script>
