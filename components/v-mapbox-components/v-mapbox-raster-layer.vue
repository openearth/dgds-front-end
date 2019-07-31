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

          if (source && source.tiles[0] === newOptions.source.tiles[0]) return

          if (source) {
            if (layer) {
              this.map.removeLayer(this.id)
            }
            this.map.removeSource(this.id)
          }
          if (get('options.source.tiles.length', this) > 0) {
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
