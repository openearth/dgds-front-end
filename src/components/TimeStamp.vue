<template>
  <v-card class="time-stamp pa-1">
    <v-card-title class="h4">
      Date raster layer
    </v-card-title>
    <time-slider
      :dates="activeRasterData.imageTimeseries"
      :set-time-index="dateIndex"
      start-at="end"
      @update-timestep="getNewRasterLayer"
    >
      <template v-slot:backButton="{ back }">
        <v-btn icon :disabled="getLoadingState" @click="back">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>
      <template v-slot:label>
        <v-select
          id="timeslider-dropdown"
          v-model="timestamp"
          :items="timeseriesItems"
          :disabled="loadingRasterLayers"
          label="Select a timestamp"
          flat
          return-object
          item-text="name"
        />
      </template>
      <template v-slot:forwardButton="{ forward }">
        <v-btn icon :disabled="getLoadingState" @click="forward">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>
    </time-slider>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import TimeSlider from '@/components/time-slider/TimeSlider.vue'

export default {
  data () {
    return {
      dateIndex: 0 // use input dropdown to, change the index of the timeslider accordingly
    }
  },
  components: {
    TimeSlider
  },
  computed: {
    ...mapState(['loadingRasterLayers']),
    ...mapGetters([
      'activeTimestamp',
      'activeRasterData',
      'getLoadingState',
      'getActiveRasterLayer'
    ]),
    timeseriesItems () {
      // The items for the dropdown menu -> a list with the dates in of the
      // active raster layer in a readable format
      if (this.activeTimestamp === 'Loading...') {
        return [
          {
            name: this.activeTimestamp,
            value: this.activeTimestamp
          }
        ]
      }
      const series = _.get(this.activeRasterData, 'imageTimeseries') || []
      return series.map(serie => {
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
        series.find((serie, i) => {
          if (moment(val, 'DD-MM-YYYY HH:mm').isSame(moment(serie.date))) {
            this.dateIndex = i
            this.getNewRasterLayer(serie)
            return true
          }
        })
      }
    }
  },
  methods: {
    ...mapActions(['retrieveRasterLayerByImageId']),
    getNewRasterLayer (serie) {
      if (this.getActiveRasterLayer) {
        const imageId = _.get(serie, 'imageId')
        // For each update of the timeslider adjust the raster layer to the new time
        this.retrieveRasterLayerByImageId({ imageId })
        this.$emit('update-timestep')
      }
    }
  }
}
</script>

<style scoped>
.time-stamp {
  position: absolute;
  top: calc(var(--spacing-default));
  left: calc(56px + var(--spacing-default));
  max-width: 20rem;
  margin-right: calc(var(--spacing-default));
  z-index: 10;
}
</style>
