<template>
  <div />
</template>

<script>
  import getColors from '../../lib/styling/colors'

  const color = getColors('dark')

  export default {
    name: 'VMapboxSelectedPointLayer',
    props: {
      geometry: {
        type: Object,
        default: () => {
          return {
            type: 'Point',
            coordinates: [],
          }
        },
      },
    },
    data() {
      return {
        map: null,
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
      geometry(newValue) {
        const selectedLayer = this.map.getSource(this.selectedLayer.id)
        selectedLayer.setData(newValue)
        this.map.moveLayer(this.selectedLayer.id)
      },
    },
    methods: {
      deferredMountedTo(map) {
        this.map = map
        this.selectedLayer.source.data = this.geometry
        map.addLayer(this.selectedLayer)
        this.map.moveLayer(this.selectedLayer.id)
      },
    },
  }
</script>
