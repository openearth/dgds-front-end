<template>
  <Panel class="timestamp">
    Date raster layer:
    <TimeSlider :dates="activeRasterData.imageTimeseries" />
  </Panel>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import Panel from './panel.vue'
import TimeSlider from './time-slider/time-slider.vue'

export default {
  components: { Panel, TimeSlider },
  computed: {
    ...mapGetters('map', [
      'activeRasterData'
    ])
  }
}
</script>

<style>
</style>
