<template>
  <div />
</template>

<script>
import getColors from '../../lib/styling/colors'

const color = getColors('dark')

export default {
  name: 'VMapboxSelectedPolygonLayer',
  props: {
    geometry: {
      type: Object,
      default: () => {
        return {
          type: 'Line',
          coordinates: []
        }
      }
    }
  },
  data () {
    return {
      map: null,
      polygonLayer: {
        id: 'selected_layer',
        type: 'line',
        source: {
          type: 'geojson',
          data: {}
        },
        paint: {
          'line-stroke-width': 8,
          'line-color': color.white100,
          'line-stroke-color': color.blue60,
          'line-stroke-opacity': 0.6
        }
      },
      pointLayer: {
        id: 'selected_layer',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {}
        },
        paint: {
          'circle-stroke-width': 8,
          'circle-color': color.white100,
          'circle-stroke-color': color.blue60,
          'circle-stroke-opacity': 0.6
        }
      }
    }
  },
  watch: {
    geometry (newValue) {
      let selectedTypeLayer = this.pointLayer
      if (newValue.type === 'Polygon') {
        selectedTypeLayer = this.polygonLayer
      }
      const selectedLayer = this.map.getSource(selectedTypeLayer.id)
      selectedLayer.setData(newValue)
      this.map.moveLayer(selectedTypeLayer.id)
    }
  },
  mounted () {
    this.map = this.getMap()
    let selectedTypeLayer = this.pointLayer
    if (this.geometry.type === 'Polygon') {
      selectedTypeLayer = this.polygonLayer
    }
    selectedTypeLayer.source.data = this.geometry
    this.map.addLayer(selectedTypeLayer)
    this.map.moveLayer(selectedTypeLayer.id)
  },
  inject: ['getMap']
}
</script>
