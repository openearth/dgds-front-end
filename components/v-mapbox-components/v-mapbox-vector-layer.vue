<template>
  <div />
</template>

<script>
export default {
  name: 'VMapboxVectorLayer',
  props: {
    layers: {
      default: () => {
        return []
      },
      type: Array,
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
    layers: {
      handler(newValue) {
        this.updateMap()
      },
      deep: true,
    },
    activeTheme() {
      this.setActiveFilter()
    },
  },
  created() {
    this.map = this.getMap()
    this.updateMap()
  },
  beforeDestroy() {
    this.layers.forEach(layer => {
      if (layer.id && this.map.getLayer(layer.id)) {
        this.map.removeLayer(layer.id)
        this.map.removeSource(layer.id)
      }
    })
  },
  methods: {
    deferredMountedTo(map) {},
    updateMap() {
      this.layers.forEach((newLayer, index) => {
        if (this.map.getLayer(this.layers[index].id)) {
          this.map.setFilter(this.layers[index].id, this.layers[index].filter)
        } else {
          this.addToMap()
        }
      })
    },
    addToMap() {
      this.layers.forEach(layer => {
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
      })
    },
  },
}
</script>
