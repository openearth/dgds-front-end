<script>
  import _ from 'lodash'
  import distance from '@turf/distance'
  import { point } from '@turf/turf'

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
      if (this.map) {
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
          this[layer.onClick.method](layer, event)
        })

        this.map.on('mouseenter', layer.id, () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })

        this.map.on('mouseleave', layer.id, () => {
          this.map.getCanvas().style.cursor = ''
        })
      },

      showGraph(layer, event) {
        this.mapPanTo(event, 500)

        const features = this.map.queryRenderedFeatures(event.point)
        this.$emit('select-locations', {
          features,
          geometry: features[0].geometry,
        })
      },
      mapPanTo(event, duration) {
        const { clientWidth } = this.map.getCanvas()

        // the timeseries panel is max 600px wide otherwise the half of the screen
        const visibleMapWidth =
          clientWidth > 1200 ? (clientWidth - 600) * 0.25 : (clientWidth / 2) * 0.5
        const targetLocation = this.map.unproject({
          x: event.point.x - visibleMapWidth,
          y: event.point.y,
        })
        this.map.panTo(targetLocation, { duration })
      },
      zoomTo(layer, event) {
        // Use zoomto and the click event to zoom in on the map and display the
        // features of the layertozoomto
        const zoomLevel = _.get(layer, 'onClick.zoomTo')
        const duration = 500

        this.map.flyTo({
          center: event.lngLat,
          zoom: zoomLevel,
        })

        setTimeout(() => {
          const bbox = this.getBBox(event.lngLat)
          // Get all features from the new center point with a small bounding box
          const features = this.map.queryRenderedFeatures(bbox)
          const from = point([event.lngLat.lng, event.lngLat.lat])

          // filter out the features belonging to the layertozoomto
          const feats = features.filter(feat => {
            return _.get(feat, 'layer.id') === _.get(layer, 'onClick.layerToZoomTo')
          })

          // calculate all distances from new center point to these features
          const distances = feats.map(f => {
            const to = point(_.get(f, 'geometry.coordinates'))
            return distance(from, to)
          })

          // and take the feature nearest to center..
          const index = distances.indexOf(Math.min.apply(null, distances))
          const nextFeat = feats[index]
          this.$emit('select-locations', {
            features: [nextFeat],
            geometry: nextFeat.geometry,
          })
        }, duration * 9)
      },

      getBBox(lngLat) {
        const bound = 0.1
        // Get bounding box of the current view
        const N = lngLat.lat + bound
        const E = lngLat.lng + bound
        const S = lngLat.lat - bound
        const W = lngLat.lng - bound
        return {
          type: 'Polygon',
          coordinates: [
            [
              [W, N],
              [W, S],
              [E, S],
              [E, N],
              [W, N],
            ],
          ],
        }
      },
    },
    render() {
      return null
    },
    inject: ['getMap'],
  }
</script>
