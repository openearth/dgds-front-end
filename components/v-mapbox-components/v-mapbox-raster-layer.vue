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
      id: undefined,
    }
  },
  watch: {
    options: {
      handler(newOptions) {
        if (this.map) {
          const source = this.map.getSource(this.id)
          const layer = this.map.getLayer(this.id)

          // If raster layer already active on map return
          if (source && source.tiles[0] === newOptions.source.tiles[0]) return

          // If not first remove layer and source before adding new raster layer
          if (source) {
            if (layer) {
              this.map.removeLayer(this.id)
            }
            this.map.removeSource(this.id)
          }

          // Only add if tiles in source if not empty
          if (get('options.source.tiles.length', this) > 0) {
            this.map.addLayer(this.options, 'locations')
          }
        }
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    deferredMountedTo(map) {
      this.map = map
      this.id = this.options.id
      this.map.addSource(this.options.id, this.options.source)
    },
  },
}
</script>
