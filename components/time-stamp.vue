<template>
  <Panel class="timestamp">
    Date raster layer:
    <TimeSlider />
  </Panel>
</template>

<script>
import Panel from './panel.vue'
import TimeSlider from './time-slider/time-slider.vue'

export default {
  components: { Panel, TimeSlider }
}
</script>

<style>
</style>
