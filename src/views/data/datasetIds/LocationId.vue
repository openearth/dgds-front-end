<template>
  <v-navigation-drawer
    class="pl-16"
    permanent
    absolute
    width="40vw"
    color="background"
  >
    <v-container class="account d-flex flex-column">
      <h2 class="h2">
        Metocean
      </h2>
      <v-btn
        icon
        class="close-button"
        @click="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div
        v-if="user"
        class="flex-grow-1 py-3 scrollbar"
        align-space-between
      >
        <v-expansion-panels
          v-model="expandedPanels"
          flat
          accordion
          multiple
          color="background"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
              data-v-step="5"
            >
              Time series
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <time-series :location-id="$route.params.locationId" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="activeLocationName?.includes('PEI')">
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Rose plot
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <rose-plot :location-id="$route.params.locationId" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="activeLocationName?.includes('PEI')">
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Joint Occurence
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <joint-occurence />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="activeLocationName?.includes('PEI')">
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Weather window
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <weather-window :location-id="$route.params.locationId" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="activeLocationName?.includes('PEI')">
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Extreme values
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <extreme-values :location-id="$route.params.locationId" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div v-else>
        <p>Please login to view the detailed graphs</p>
      </div>
      <div class="flex-shrink-1 bodytext-xs disclaimer">
        Global datasets are generated with great care but may locally contain
        inaccuracies. See the dataset descriptions for more information.
      </div>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import _ from 'lodash'
import flatten from 'lodash/flatten'
import { mapMutations, mapGetters, mapActions } from 'vuex'

import {
  TimeSeries,
  RosePlot,
  ExtremeValues,
  WeatherWindow,
  JointOccurence
} from '@/components/metocean'

export default {
  components: {
    TimeSeries,
    RosePlot,
    ExtremeValues,
    WeatherWindow,
    JointOccurence
  },
  data() {
    return {
      activeLocationName: '',
      expandedPanels: []
    }
  },
  computed: {
    ...mapGetters([
      'colors',
      'user',
      'activePointDataPerDataset',
      'getActiveRasterLayer',
      'activeRasterData',
      'activeSummary',
      'getActiveLocationName',
      'getExpandedPanels'
    ]),
    datasets() {
      const activePointData = this.activePointDataPerDataset
      const result = Object.keys(activePointData).map((pointId) =>
        _.get(activePointData, [pointId][0])
      )
      return flatten(result)
    },
    hasSerieData() {
      if (_.get(this.datasets, '[0].type') === 'images') {
        return _.get(this.datasets, '[0].imageUrl')
      } else {
        return (
          _.get(this.datasets, '[0].serie') &&
          _.get(this.datasets, '[0].serie').length > 0
        )
      }
    }
  },
  watch: {
    getActiveLocationName: {
      immediate: true,
      handler(newVal) {
        this.activeLocationName = newVal
      }
    },
    getExpandedPanels: {
      immediate: true,
      handler(newVal) {
        this.expandedPanels = newVal
      }
    },
    expandedPanels(newVal) {
      this.$store.commit('setExpandedPanels', newVal)
    }
  },

  mounted() {
    setTimeout(this.updateLocationPanel, 3000)
    this.expandedDatasets = [...Array(this.datasets.length).keys()]
  },

  methods: {
    ...mapMutations([
      'clearActiveLocationIds',
      'setActiveLocationIds',
      'setExpandedPanels'
    ]),
    ...mapActions(['loadPointDataForLocation', 'loadActiveStateName']),
    updateLocationPanel() {
      const {
        // datasetIds,
        locationId
      } = this.$route.params
      // console.log('Inside updateLocationPanel:', { datasetIds, locationId })
      this.setActiveLocationIds(locationId ? [locationId] : [])
      // if (this.loadActiveStateName.contains('PEI'))
      //   this.peiPoint == true
      // this.loadPointDataForLocation({ datasetIds, locationId });
    },
    close() {
      this.$store.commit('setExpandedPanels', [])
      this.$router.push({
        path: `/data/${this.$route.params.datasetIds}`,
        params: { datasetIds: this.$route.params.datasetIds }
      })
    }
  }
}
</script>

<style lang="css" scoped>
.disclaimer {
  text-align: center;
}
.chart {
  height: 500px;
}
</style>
