<template>
  <div class='data-layers'>
    <data-set-controls :datasets="datasetsInActiveTheme" />
    <map-component />
    <time-stamp v-show="validTimestamp && getActiveRasterLayer"/>
    <v-tour :steps="tourSteps" :options="tourConfig" name="introduction"></v-tour>
    <router-view />
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent'
import DataSetControls from '@/components/DataSetControls'
import TimeStamp from '@/components/TimeStamp.vue'
import { tourConfig, tourSteps } from '@/plugins/vue-tour'
import * as Cookies from 'tiny-cookie'

import { mapGetters } from 'vuex'

export default {
  name: 'DataLayers',
  components: {
    MapComponent,
    DataSetControls,
    TimeStamp
  },
  data: () => ({
    tourConfig,
    tourSteps
  }),
  mounted () {
    this.showTour()
  },
  computed: {
    ...mapGetters(['datasetsInActiveTheme', 'getActiveRasterLayer', 'activeTimestamp']),
    validTimestamp () {
      return ![null, '', 'Invalid date'].includes(this.activeTimestamp)
    }
  },
  methods: {
    showTour (hideTour = Cookies.get('hideTour')) {
      if (!hideTour) {
        this.$tours.introduction.start()
        Cookies.set('hideTour', false)
      }
    }
  }
}
</script>

<style scoped>
.data-layers {
  width: 100%;
  height: 100%;
}
</style>
