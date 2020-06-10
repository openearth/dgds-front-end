<template>
  <panel class="timestamp">
    <h3 class="h4">
      Date raster layer
    </h3>
    <time-slider
      :dates="activeRasterData.imageTimeseries"
      :set-time-index="dateIndex"
      @update-timestep="getNewRasterLayer"
      start-at="end"
    >
      <template v-slot:backButton="{ back }">
        <ui-button-icon :disabled="getLoadingState" @click="back">
          <icon :mdi="true" class="icons" name="chevron_left" />
        </ui-button-icon>
      </template>
      <template v-slot:label>
        <ui-select
          id="timeslider-dropdown"
          v-model="timestamp"
          :options="timeseriesItems"
          :disabled="loadingRasterLayers"
          label="Select a timestamp"
        />
      </template>
      <template v-slot:forwardButton="{ forward }">
        <ui-button-icon :disabled="getLoadingState" @click="forward">
          <icon :mdi="true" class="icons" name="chevron_right" />
        </ui-button-icon>
      </template>
    </time-slider>
  </panel>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import _ from 'lodash'
  import moment from 'moment'
  import UiButtonIcon from './ui-button-icon'
  import UiSelect from './ui-select'
  import Icon from './icon'
  import Panel from './panel.vue'
  import TimeSlider from './time-slider/time-slider.vue'

  export default {
    components: { Panel, TimeSlider, UiButtonIcon, Icon, UiSelect },
    data() {
      return {
        dateIndex: 0, // use input dropdown to, change the index of the timeslider accordingly
      }
    },
    computed: {
      ...mapState('map', ['loadingRasterLayers']),
      ...mapGetters('map', [
        'activeTimestamp',
        'activeRasterData',
        'getLoadingState',
        'getActiveRasterLayer',
      ]),
      timeseriesItems() {
        // The items for the dropdown menu -> a list with the dates in of the
        // active raster layer in a readable format
        if (this.activeTimestamp === 'Loading...') {
          return [
            {
              name: this.activeTimestamp,
              value: this.activeTimestamp,
            },
          ]
        }
        const series = _.get(this.activeRasterData, 'imageTimeseries') || []
        return series.map(serie => {
          return {
            value: moment(serie.date).format('DD-MM-YYYY HH:mm'),
            name: moment(serie.date).format('DD-MM-YYYY HH:mm'),
          }
        })
      },
      timestamp: {
        // This is the input for the v-model of the select of the dropdown menu
        get() {
          return this.activeTimestamp
        },
        set(val) {
          if (!val) {
            return
          }
          const series = _.get(this.activeRasterData, 'imageTimeseries')
          series.find((serie, i) => {
            if (moment(val, 'DD-MM-YYYY HH:mm').isSame(moment(serie.date))) {
              this.dateIndex = i
              this.getNewRasterLayer(serie)
              return true
            }
          })
        },
      },
    },
    methods: {
      ...mapActions('map', ['retrieveRasterLayer']),
      getNewRasterLayer(serie) {
        if (this.getActiveRasterLayer) {
          const imageId = _.get(serie, 'imageId')
          // For each update of the timeslider adjust the raster layer to the new time
          this.retrieveRasterLayer({ imageId })
          this.$emit('update-timestep')
        }
      },
    },
  }
</script>
