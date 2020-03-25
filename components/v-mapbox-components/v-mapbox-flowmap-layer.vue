<template>
  <div class="offscreen">
    <!-- <img src="~/assets/glossis-uv.png" class="uv" /> -->
    <canvas id="uv" width="1024" height="1023" />
  </div>
</template>
<script>
// https://github.com/mapbox/webgl-wind
import * as windGl from '@openearth/windgl'

console.log('WindGL', windGl)

export default {
  name: 'VMapboxFlowmapLayer',
  props: {
    options: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    renderCanvas () {
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
    deferredMountedTo (map) {
      const source = windGl.source('glossis/tile.json')
      const layers = [
        {
          type: 'particles',
          after: 'waterway-label',

          properties: {
            'particle-speed': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              0.9,
              8,
              1.5
            ],
            'particle-color': 'rgba(60, 60, 90, 0.9)'
          }
        }
      ]
      layers.forEach((layer) => {
        const { type, after, properties } = layer
        if (windGl[type]) {
          layer = windGl[type](
            Object.assign(
              {
                id: type,
                source
              },
              properties || {}
            )
          )
        }
        if (after) {
          map.addLayer(layer, after)
        } else {
          map.addLayer(layer)
        }
      })
      this.renderCanvas()
      document.querySelector('.mapboxgl-canvas').id = 'mapbox-canvas'
      const testSource = {
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
        source: testSource,
        paint: {}
      })
    }
  },
  render () {
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
