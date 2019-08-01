<template>
  <div />
</template>

<script>
export default {
  name: 'VMapboxVectorLayer',
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
        this.addToMap()
      },
      deep: true,
    },
    activeTheme() {
      this.setActiveFilter()
    },
  },
  created() {
    this.map = this.getMap()
    if (this.map.loaded()) {
      this.addToMap()
    }
  },
  beforeDestroy() {
    if (this.layer.id && this.map.getLayer(this.layer.id)) {
      this.map.removeLayer(this.layer.id)
      this.map.removeSource(this.layer.id)
    }
  },
  methods: {
    deferredMountedTo(map) {
      this.addToMap()
    },
    addToMap() {
      if (this.layer) {
        this.map.addLayer(this.layer)

        this.map.on('click', this.layer.id, event => {
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
          const features = event.features
          this.map.panTo(targetLocation, { duration })
          setTimeout(() => {
            this.$emit('select-locations', features)
          }, duration)
        })

        this.map.on('mouseenter', this.layer.id, () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })

        this.map.on('mouseleave', this.layer.id, () => {
          this.map.getCanvas().style.cursor = ''
        })
      }
    },
  },
}
</script>
