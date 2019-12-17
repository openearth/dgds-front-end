<template>
  <div />
</template>

<script>
import get from 'lodash/fp/get'
export default {
  name: 'VMapboxRasterLayer',
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
      map: undefined,
      // TODO: id or options.id? choose 1
      id: undefined,
    }
  },
  computed: {
    layer() {
      return this.map.getLayer(this.options.id)
    },
    source() {
      return this.map.getSource(this.options.id)
    },
  },
  watch: {
    options: {
      handler(newOptions) {
        if (this.map) {
          const source = this.map.getSource(this.id)
          const layer = this.map.getLayer(this.id)

          // if the newOptions has tiles check if raster layer already active on map return
          if (get('tiles[0]', source) === get('source.tiles[0]', newOptions)) {
            return
          }

          // If not first remove layer and source before adding new raster layer
          if (source) {
            if (layer) {
              this.unsubscribe(this.id)
              this.map.removeLayer(this.id)
            }
            this.map.removeSource(this.id)
          }

          // Only add if tiles in source are not empty
          if (get('source.tiles[0]', newOptions)) {
            this.map.addLayer(newOptions, 'water-border')
          }
          console.log('subscribing to', newOptions)
          this.subscribe(newOptions.id)
        }
      },
      deep: true,
    },
  },
  mounted() {
    console.log('mounted', this)
  },
  beforeDestroy() {
    const layer = this.layer
    if (layer.id && this.map.getLayer(layer.id)) {
      this.map.off('click', layer.id)
      this.map.removeLayer(layer.id)
      this.map.removeSource(layer.id)
    }
  },
  methods: {
    deferredMountedTo(map) {
      this.map = map
      this.id = this.options.id
      this.map.addLayer(this.options, 'water-border')
      console.log('subscribing to  click')
    },
    subscribe(id) {
      // Listening on raster layers is not  defined. So we listen to the map and filter events.
      // https://github.com/mapbox/mapbox-gl-js/issues/1404
      this.map.on('click', event => {
        const extendedEvent = {
          ...event,
          layer: this.layer,
          source: this.source,
        }
        this.$emit('click', extendedEvent)
      })
    },
    unsubscribe(id) {
      this.map.off('click', id)
    },
  },
}
</script>
