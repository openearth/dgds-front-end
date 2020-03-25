<template>
  <Panel class="timestamp">
    <span class="data-set-control-menu__title h4 unselectable">
      Date raster layer
    </span>
    <TimeSlider
      :dates="activeRasterData.imageTimeseries"
      start-at="end"
      :set-time-index="dateIndex"
      @update-timestep="getNewRasterLayer"
    >
      <template v-slot:backButton="{back}">
        <UiButtonIcon :disabled="getLoadingState" @click="back">
          <Icon class="icons" :mdi="true" name="chevron_left" />
        </UiButtonIcon>
      </template>
      <template v-slot:label>
        <UiDropdown id="timeslider-dropdown" :options="timeseriesItems" :value.sync="timestamp" />
      </template>
      <template v-slot:forwardButton="{forward}">
        <UiButtonIcon :disabled="getLoadingState" @click="forward">
          <Icon class="icons" :mdi="true" name="chevron_right" />
        </UiButtonIcon>
      </template>
    </TimeSlider>
  </Panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import UiButtonIcon from './ui-button-icon'
import UiDropdown from './ui-dropdown'
import Icon from './icon'
import Panel from './panel.vue'
import TimeSlider from './time-slider/time-slider.vue'

export default {
  components: { Panel, TimeSlider, UiButtonIcon, Icon, UiDropdown },
  data () {
    return {
      dateIndex: 0 // use input dropdown to, change the index of the timeslider accordingly
    }
  },
  computed: {
    ...mapGetters('map', [
      'activeTimestamp',
      'activeRasterData',
      'getLoadingState',
      'getActiveRasterLayer'
    ]),
    timeseriesItems () {
      // The items for the dropdown menu -> a list with the dates in of the
      // active raster layer in a readable format
      if (this.activeTimestamp === 'Loading...') {
        return [{
          name: this.activeTimestamp,
          value: this.activeTimestamp
        }]
      }
      const series = _.get(this.activeRasterData, 'imageTimeseries') || []
      return series.map((serie) => {
        return {
          value: moment(serie.date).format('DD-MM-YYYY HH:mm'),
          name: moment(serie.date).format('DD-MM-YYYY HH:mm')
        }
      })
    },
    timestamp: {
      // This is the input for the v-model of the select of the dropdown menu
      get () {
        return this.activeTimestamp
      },
      set (val) {
        if (!val) {
          return
        }
        const series = _.get(this.activeRasterData, 'imageTimeseries')
        const serie = series.find((serie, i) => {
          if (moment(val, 'DD-MM-YYYY HH:mm').isSame(moment(serie.date))) {
            this.dateIndex = i
            return true
          }
        })
      }
    }
  },
  methods: {
    ...mapActions('map', ['retrieveRasterLayerByImageId']),
    getNewRasterLayer (serie) {
      if (this.getActiveRasterLayer) {
        // For each update of the timeslider adjust the raster layer to the new time
        this.retrieveRasterLayerByImageId(_.get(serie, 'imageId'))
        this.$emit('update-timestep')
      }
    }
  }
}
</script>

<style>
</style>
