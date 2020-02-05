<template>
  <Panel class="timestamp">
    Date raster layer:
    <TimeSlider
      :dates="activeRasterData.imageTimeseries"
      :label="activeTimestamp"
      start-at="end"
      @update-timestep="getNewRasterLayer"
    />
  </Panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import Panel from './panel.vue'
import TimeSlider from './time-slider/time-slider.vue'

export default {
  components: { Panel, TimeSlider },
  computed: {
    ...mapGetters('map', [
      'activeTimestamp',
      'activeRasterData'
    ])
  },
  methods: {
    ...mapActions('map', ['retrieveRasterLayerByImageId']),
    getNewRasterLayer (serie) {
      this.retrieveRasterLayerByImageId(_.get(serie, 'imageId'))
    }
  }
}
</script>

<style>
</style>
