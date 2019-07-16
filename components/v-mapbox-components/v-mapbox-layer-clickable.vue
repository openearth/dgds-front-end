<template>
  <div />
</template>

<script>
import getColors from '../../lib/styling/colors'

const dark = getColors('dark')
const light = getColors('light')

export default {
  name: 'VMapboxLayerClickable',
  props: {
    id: {
      type: String,
      required: true,
    },
    options: {
      default: () => {
        return {}
      },
      type: Object,
    },
    filter: {
      default: () => [],
      type: Array,
    },
    activeLocationIds: {
      type: Array,
      default: () => [],
    },
    activeTheme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      map: null,
    }
  },
  watch: {
    options: {
      handler(newValue) {
        this.addToMap()
      },
      deep: true,
    },
    filter: {
      handler(newValue) {
        if (this.map) {
          this.map.setFilter(this.id, newValue)
        }
      },
      deep: true,
    },
    activeLocationIds() {
      this.setActiveFilter()
    },
    activeTheme() {
      this.setActiveFilter()
    },
  },
  methods: {
    deferredMountedTo(map) {
      this.map = map
      this.addToMap()
    },
    setActiveFilter() {
      if (this.map) {
        const filters = this.activeLocationIds.map(id => [
          '==',
          ['get', 'locationId'],
          id,
        ])
        this.map.setPaintProperty(this.id, 'circle-stroke-width', [
          'case',
          ['any', ...filters],
          8,
          4,
        ])
        this.map.setPaintProperty(this.id, 'circle-color', [
          'case',
          ['any', ...filters],
          this.activeTheme === 'dark' ? dark.white100 : light.white100,
          this.activeTheme === 'dark' ? dark.pink : light.pink,
        ])
        this.map.setPaintProperty(this.id, 'circle-stroke-color', [
          'case',
          ['any', ...filters],
          this.activeTheme === 'dark' ? dark.blue60 : light.blue60,
          this.activeTheme === 'dark' ? dark.black100 : light.white100,
        ])
        this.map.setPaintProperty(this.id, 'circle-stroke-opacity', [
          'case',
          ['any', ...filters],
          1,
          this.activeTheme === 'dark' ? 0.2 : 0.6,
        ])
      }
    },
    addToMap() {
      const id = (this.options && this.options.id) || this.id
      if (this.options) {
        this.map.addLayer({ ...this.options, id })
        this.setActiveFilter()

        if (this.filter !== []) {
          this.map.setFilter(id, this.filter)
        }
        this.map.on('click', id, event => {
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

        this.map.on('mouseenter', 'locations', () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })

        this.map.on('mouseleave', 'locations', () => {
          this.map.getCanvas().style.cursor = ''
        })
      }
    },
  },
}
</script>
