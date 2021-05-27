<template>
  <v-card class="time-stamp pa-1">
    <v-card-title class="h4">
      Date raster layer
    </v-card-title>
    <time-slider
      :dates="timestampItems"
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
        <v-combobox
          id="timeslider-dropdown"
          v-model="timestamp"
          :items="timestampItems"
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
    timestampItems () {
      // The items for the dropdown menu -> a list with the dates in of the
      // active raster layer in a readable format
      if (this.activeTimestamp === 'Loading...') {
        return [
          {
            date: this.activeTimestamp
          }
        ]
      }
      const series = _.clone(_.get(this.activeRasterData, 'links') || [])
      return series.filter(serie => serie.rel === 'item')
    },
    dateIndex () {
      return this.timestampItems.findIndex(item => {
        return item.date === this.activeTimestamp
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
        this.timestampItems.forEach((serie, i) => {
          if (moment(val.date, 'DD-MM-YYYY HH:mm').isSame(moment(serie.date, 'DD-MM-YYYY HH:mm'))) {
            this.loadActiveRasterLayer(serie)
            return true
          }
        })
      }
    }
  },
  methods: {
    ...mapActions(['loadActiveRasterLayer']),
    getNewRasterLayer (serie) {
      this.loadActiveRasterLayer(serie)
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
