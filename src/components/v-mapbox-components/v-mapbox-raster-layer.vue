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
      type: Object
    }
  },
  data () {
    return {
      map: undefined,
      // TODO: id or options.id? choose 1
      id: undefined
    }
  },
  computed: {
    layer () {
      return this.map.getLayer(this.options.id)
    },
    source () {
      return this.map.getSource(this.options.id)
    }
  },
  watch: {
    options: {
      handler (newOptions) {
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
              this.map.removeLayer(this.id)
            }
            this.map.removeSource(this.id)
          }

          // Only add if tiles in source are not empty
          if (get('source.tiles[0]', newOptions)) {
            this.map.addLayer(newOptions, 'water-border')
          }
        }
      },
      deep: true
    }
  },
  beforeDestroy () {
    const layer = this.layer
    if (layer.id && this.map.getLayer(layer.id)) {
      this.map.removeLayer(layer.id)
      this.map.removeSource(layer.id)
    }
  },
  mounted () {
    this.map = this.getMap()
    this.id = this.options.id
    if (this.options.source.tiles) {
      this.map.addLayer(this.options, 'water-border')
    }
    this.map.on('click', event => {
      const bbox = {
        type: 'Point',
        coordinates: [event.lngLat.lng, event.lngLat.lat]
      }
      this.$emit('click', bbox)
    })
  },
  inject: ['getMap']
}
</script>
