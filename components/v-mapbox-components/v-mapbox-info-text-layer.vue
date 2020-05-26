<script>
  export default {
    name: 'VMapboxSelectedPointLayer',
    props: {
      geometry: {
        type: Object,
        required: true,
        default: () => {
          return {
            type: 'Point',
            coordinates: [],
          }
        },
      },
      message: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        map: null,
        selectedLayers: [
          {
            id: 'info_point_layer',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {},
            },
            paint: {
              'circle-color': 'black',
              'circle-radius': 3,
              'circle-stroke-width': 2,
              'circle-stroke-color': 'white',
            },
          },
          {
            id: 'info_text_layer',
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {},
            },
            layout: {
              'text-field': '',
              'text-anchor': 'bottom',
              'text-radial-offset': 1,
            },
            paint: {
              'text-halo-color': 'white',
              'text-halo-width': 2,
              'text-halo-blur': 2,
            },
          },
        ],
      }
    },
    watch: {
      geometry(newValue) {
        this.selectedLayers.forEach(selectedLayer => {
          const layerId = selectedLayer.id
          const layer = this.map.getSource(layerId)
          layer.setData(newValue)

          // For the text layer, also change the value of the text
          if (selectedLayer.type === 'symbol') {
            this.map.setLayoutProperty(layerId, 'text-field', this.message)
          }

          this.map.moveLayer(layerId)
        })
      },
    },
    methods: {
      deferredMountedTo(map) {
        this.map = map
        this.selectedLayers.forEach(selectedLayer => {
          selectedLayer.source.data = this.geometry
          map.addLayer(selectedLayer)
          this.map.moveLayer(selectedLayer.id)
        })
      },
    },
    render() {
      return null
    },
  }
</script>
