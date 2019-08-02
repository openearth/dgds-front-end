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

          // if the newOptions has tiles check if raster layer already active on map return
          if (newOptions.source.tiles) {
            if (
              source &&
              newOptions &&
              source.tiles[0] === newOptions.source.tiles[0]
            )
              return
          }

          // If not first remove layer and source before adding new raster layer
          if (source) {
            if (layer) {
              this.map.removeLayer(this.id)
            }
            this.map.removeSource(this.id)
          }

          // Only add if tiles in source if not empty
          if (get('options.source.tiles.length[0]', this) === 0) {
          } else {
            this.map.addLayer(this.options, 'water-border')
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
