<template>
  <panel class="timestamp">
    Date raster layer:
    <time-slider
      :dates="activeRasterData.imageTimeseries"
      start-at="end"
      @update-timestep="getNewRasterLayer"
    >
      <template v-slot:backButton="{ back }">
        <ui-button-icon :disabled="getLoadingState" @click="back">
          <icon class="icons" :mdi="true" name="chevron_left" />
        </ui-button-icon>
      </template>
      <template v-slot:label>
        {{ activeTimestamp }}
      </template>
      <template v-slot:forwardButton="{ forward }">
        <ui-button-icon :disabled="getLoadingState" @click="forward">
          <icon class="icons" :mdi="true" name="chevron_right" />
        </ui-button-icon>
      </template>
    </time-slider>
  </panel>
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
        'getLoadingState',
        'getActiveRasterLayer',
      ]),
    },
    methods: {
      ...mapActions('map', ['retrieveRasterLayerByImageId']),
      getNewRasterLayer(serie) {
        if (this.getActiveRasterLayer) {
          // For each update of the timeslider adjust the raster layer to the new time
          this.retrieveRasterLayerByImageId(_.get(serie, 'imageId'))
          this.$emit('update-timestep')
        }
      },
    },
  }
</script>

<style></style>
