<template>
  <div />
</template>

<script>
export default {
  props: {
    layer: {
      default: () => {
        return {}
      },
      type: Object,
    },
    activeTheme: {
      type: String,
      required: true,
    },
  },
  inject: ['getMap'],
  data() {
    return {
      map: null,
    }
  },
  watch: {
    layer: {
      handler(newValue) {
        this.updateMap()
      },
      deep: true,
    },
    activeTheme() {
      this.setActiveFilter()
    },
  },
  mounted() {
    this.map = this.getMap()
    if (this.map.loaded()) {
      this.updateMap()
    }
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
      this.updateMap()
    },
    updateMap() {
      if (this.map.getLayer(this.layer.id)) {
        this.map.setFilter(this.layer.id, this.layer.filter)
      } else {
        this.addToMap()
      }
    },
    addToMap() {
      const layer = this.layer
      this.map.addLayer(layer)
      this.map.on('click', layer.id, event => {
        const { clientWidth } = this.map.getCanvas()

        // prettier-ignore
        // the timeseries panel is max 600px wide otherwise the half of the screen
        const visibleMapWidth = clientWidth > 1200
          ? (clientWidth - 600) * 0.25
          : (clientWidth / 2) * 0.5
        const targetLocation = this.map.unproject({
          x: event.point.x - visibleMapWidth,
          y: event.point.y,
        })
        const duration = 500
        this.map.panTo(targetLocation, { duration })

        const features = this.map.queryRenderedFeatures(event.point)
        setTimeout(() => {
          this.$emit('select-locations', {
            features,
            geometry: features[0].geometry,
          })
        }, duration)
      })

      this.map.on('mouseenter', layer.id, () => {
        this.map.getCanvas().style.cursor = 'pointer'
      })

      this.map.on('mouseleave', layer.id, () => {
        this.map.getCanvas().style.cursor = ''
      })
    },
  },
}
</script>
