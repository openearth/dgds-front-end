<template>
  <v-card class="time-stamp pa-1">
    <v-card-title class="h4">
      Date raster layer
    </v-card-title>
    <time-slider
      :dates="timeseriesItems"
      :set-time-index="dateIndex"
      start-at="end"
      @update-timestep="loadActiveRasterLayer"
    >
      <template v-slot:backButton="{ back }">
        <v-btn icon :disabled="getLoadingState" @click="back">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>
      <template v-slot:label>
        <v-combobox
          id="timeslider-dropdown"
          v-model="timestamp"
          :items="timeseriesItems"
          :disabled="loadingRasterLayers"
          label="Select a timestamp"
          flat
          item-text="date"
          item-value="date"
          return-object
          color="formBase"
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
            date: this.activeTimestamp
          }
        ]
      }
      let series = _.get(this.activeRasterData, 'links') || []
      series = series.filter(serie => serie.rel === 'item')
      return series.map(serie => {
        serie.date = moment(serie.date).format('DD-MM-YYYY HH:mm')
        return serie
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
        let series = _.get(this.activeRasterData, 'links') || []
        series = series.filter(serie => serie.rel === 'item')
        series.forEach((serie, i) => {
          if (moment(val.date, 'DD-MM-YYYY HH:mm').isSame(moment(serie.date))) {
            this.dateIndex = i
            this.loadActiveRasterLayer()
            return true
          }
        })
      }
    }
  },
  methods: {
    ...mapActions(['retrieveRasterLayerByImageId', 'loadActiveRasterLayer']),
    getNewRasterLayer (serie) {
      if (this.getActiveRasterLayer) {
        // const imageId = _.get(serie, 'imageId')
        this.loadActiveRasterLayer()
        // For each update of the timeslider adjust the raster layer to the new time
        // this.retrieveRasterLayerByImageId({ imageId })
        // this.$emit('update-timestep')
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
}
</style>
