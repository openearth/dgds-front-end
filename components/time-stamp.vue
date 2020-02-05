<template>
  <Panel class="timestamp">
    Date raster layer:
    <TimeSlider
      :dates="activeRasterData.imageTimeseries"
      start-at="end"
      @update-timestep="getNewRasterLayer"
    >
      <template v-slot:backButton="{back}">
        <UiButtonIcon :disabled="getLoadingState" @click="back">
          <Icon class="icons" :mdi="true" name="chevron_left" />
        </UiButtonIcon>
      </template>
      <template v-slot:label>
        {{ activeTimestamp }}
      </template>
      <template v-slot:forwardButton="{forward}">
        <UiButtonIcon :disabled="getLoadingState" @click="forward">
          <Icon class="icons" :mdi="true" name="chevron_right" @click="forward"/>
        </UiButtonIcon>
      </template>
    </TimeSlider>
  </Panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import UiButtonIcon from './ui-button-icon'
import Icon from './icon'
import Panel from './panel.vue'
import TimeSlider from './time-slider/time-slider.vue'

export default {
  components: { Panel, TimeSlider, UiButtonIcon, Icon },
  computed: {
    ...mapGetters('map', [
      'activeTimestamp',
      'activeRasterData',
      'getLoadingState'
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
