<template>
  <div />
</template>

<script>
import getColors from '../../lib/styling/colors'

const color = getColors('dark')

export default {
  name: 'VMapboxSelectedPointLayer',
  props: {
    coordinates: {
      type: Array,
      default: () => [0, 0],
    },
  },
  data() {
    return {
      map: null,
      geojson: {
        type: 'Point',
        coordinates: [0, 0],
      },
      selectedLayer: {
        id: 'selected_point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {},
        },
        paint: {
          'circle-stroke-width': 8,
          'circle-color': color.white100,
          'circle-stroke-color': color.blue60,
          'circle-stroke-opacity': 0.6,
        },
      },
    }
  },
  watch: {
    coordinates(newValue) {
      const selectedLayer = this.map.getSource(this.selectedLayer.id)
      this.geojson.coordinates = newValue
      selectedLayer.setData(this.geojson)
    },
  },
  methods: {
    deferredMountedTo(map) {
      this.map = map
      this.selectedLayer.source.data = this.geojson
      map.addLayer(this.selectedLayer)
    },
  },
}
</script>
