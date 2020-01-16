<template>
  <div class="offscreen">
    <!-- <img src="~/assets/glossis-uv.png" class="uv" /> -->
    <canvas id="uv" width="1024" height="1024"></canvas>
  </div>
</template>
<script>
// https://github.com/mapbox/webgl-wind
import get from 'lodash/fp/get'
import WindGL from '@/lib/styling/windgl.js'

export default {
  name: 'VMapboxCanvasLayer',
  props: {
    options: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    renderCanvas() {
      const canvas = this.$el.querySelector('#uv')
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'rgb(0, 255, 0)'
      ctx.fillRect(0, 0, 512, 512)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(
        200, //
        200,
        50,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = 'red'
      ctx.fill()
      ctx.closePath()
    },
    deferredMountedTo(map) {
      this.renderCanvas()
      document.querySelector('.mapboxgl-canvas').id = 'mapbox-canvas'
      const source = {
        type: 'canvas',
        canvas: 'uv',
        coordinates: [
          [1, 55], //
          [8, 55],
          [8, 52],
          [1, 52]
        ],
        animate: true
      }

      map.addLayer({
        id: 'test-canvas',
        type: 'raster',
        source,
        paint: {}
      })
    }
  },
  render() {
    return null
  },
  inject: ['getMap']
}
</script>
<style>
#uv {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
