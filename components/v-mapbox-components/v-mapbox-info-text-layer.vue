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
      selectedLayer: {
        id: 'info_text_layer',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {},
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 2,
          'text-halo-blur': 2,
        },
      },
    }
  },
  watch: {
    geometry(newValue) {
      const selectedLayer = this.map.getSource(this.selectedLayer.id)
      selectedLayer.setData(newValue)
      this.map.setLayoutProperty(
        this.selectedLayer.id,
        'text-field',
        this.message,
      )
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
  render() {
    return null
  },
}
</script>
