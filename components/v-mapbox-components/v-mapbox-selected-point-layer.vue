<template>
  <div />
</template>

<script>
import get from 'lodash/fp/get'
import getColors from '../../lib/styling/colors'

const color = getColors('dark')

export default {
  name: 'VMapboxSelectedPointLayer',
  props: {
    coordinates: {
      type: Array,
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
      console.log('changing coordiantes', newValue)
      const layer = this.map.getSource(this.selectedLayer.id)
      this.geojson.coordinates = newValue
      console.log(layer, this.geojson)
      layer.setData(this.geojson)
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
