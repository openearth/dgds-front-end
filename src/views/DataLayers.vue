<template>
  <div class="data-layers">
    <data-set-controls
      ref="dataSetControls"
      :datasets="datasetsInActiveTheme"
    />
    <map-component ref="mapComponent" />
    <time-stamp v-show="validTimestamp && getActiveRasterLayer" />
    <v-tour
      :steps="tourSteps"
      :options="tourConfig"
      name="introduction"
      :callbacks="myCallbacks"
    />
    <router-view />
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent'
import DataSetControls from '@/components/DataSetControls'
import TimeStamp from '@/components/TimeStamp.vue'
import { tourConfig, tourSteps } from '@/plugins/vue-tour'
import * as Cookies from 'tiny-cookie'
import { mapGetters } from 'vuex'

export default {
  name: 'DataLayers',
  components: {
    MapComponent,
    DataSetControls,
    TimeStamp
  },
  data() {
    return {
      tourConfig,
      tourSteps
    }
  },
  computed: {
    ...mapGetters([
      'datasetsInActiveTheme',
      'getActiveRasterLayer',
      'activeTimestamp',
      'toggleLocationDataset'
    ]),
    validTimestamp() {
      return ![null, '', 'Invalid date'].includes(this.activeTimestamp)
    },
    myCallbacks() {
      return {
        onPreviousStep: this.myCustomPreviousStepCallback,
        onNextStep: this.myCustomNextStepCallback
      }
    }
  },
  mounted() {
    this.showTour()
  },
  methods: {
    expandTimeSeriesPanel(remove) {
      this.$store.commit('setExpandedPanels', remove ? [] : [0])
    },
    emitSelectLocations() {
      const features = this.$refs.mapComponent.map.queryRenderedFeatures()

      const feature = features.find(
        (feature) => feature.sourceLayer === 'metocean_points'
      )

      if (feature) {
        this.$refs.mapComponent.selectLocations({
          features: [feature],
          geometry: feature.geometry
        })
      }
    },
    emitToggleDataset(id, bool) {
      const datasets = this.datasetsInActiveTheme
      let dataset = datasets[id]

      const activeIds = this.$refs.dataSetControls.getActiveVectorDataIds

      if (activeIds === id) {
        if (bool === false) {
          dataset.visible = false
          this.$refs.dataSetControls.toggleLocationDataset(dataset)
        }
      } else {
        dataset.visible = bool
        this.$refs.dataSetControls.toggleLocationDataset(dataset)
      }
    },
    myCustomPreviousStepCallback(currentStep) {
      if (currentStep === 2) {
        this.emitToggleDataset('mo', false)
      }
      if (currentStep === 3) {
        this.$refs.mapComponent.selectLocations()
        this.$store.commit('setExpandedPanels', [])
      }
      if (currentStep === 4) {
        this.emitSelectLocations()
      }
      if ([5, 6].includes(currentStep)) {
        this.expandTimeSeriesPanel(false)
      }
    },
    myCustomNextStepCallback(currentStep) {
      if (currentStep === 1) {
        this.emitToggleDataset('mo', true)
      }
      if (currentStep === 2) {
        this.emitSelectLocations()
      }
      if (currentStep === 3) {
        this.expandTimeSeriesPanel(false)
      }
    },
    showTour(hideTour = Cookies.get('hideTour')) {
      if (!hideTour) {
        this.$tours.introduction.start()
        Cookies.set('hideTour', false)
      }
    }
  }
}
</script>

<style scoped>
.data-layers {
  width: 100%;
  height: 100%;
}
</style>
