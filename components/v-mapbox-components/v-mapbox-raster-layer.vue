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
        console.log(newOptions)

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

          // Only add if tiles in source if not empty
          if (
            get('source.tiles.length', newOptions) > 0 &&
            get('source.tiles[0]', newOptions) !== ''
          ) {
            this.map.addLayer(newOptions, 'water-border')
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
