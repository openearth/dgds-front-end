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
        class="flex-grow-1 py-3 scrollbar"
        align-space-between
      >

        <v-expansion-panels
          flat
          accordion
          multiple
          color="background"
        >
          <v-expansion-panel
            v-for="data in datasets"
            :key="`${locations}-${data.id}-${activeSummaryId}`"
          >
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              {{ data.datasetName }}
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <graph-line
                :image-url="data.imageUrl"
                :category="data.category"
                :series="[data.serie]"
                theme="dark"
                :collapsible="true"
                :units="data.units"
                :type="data.type"
                :time-format-type="data.timeFormat"
                :time-span-type="data.timeSpan"
                :parameter-id="data.id"
                :title="data.datasetName"
                :set-mark-point="data.id === getActiveRasterLayer"
                :time-step="getTimeStep"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Time series
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <time-series />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Rose plot
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <rose-plot />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
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
          <v-expansion-panel>
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Weather window
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <weather-window />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header
              class="h4"
              color="background"
              dark
            >
              Extreme values
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <extreme-values />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="flex-shrink-1 bodytext-xs disclaimer">
        Global datasets are generated with great care but may locally contain
        inaccuracies. See the dataset descriptions for more information.
      </div>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
  getCurrentInstance
} from 'vue'
import _ from 'lodash'
import flatten from 'lodash/flatten'
import { mapMutations, mapGetters, mapActions, useStore } from 'vuex'
import GraphLine from '@/components/GraphLine'

import {
  TimeSeries,
  RosePlot,
  ExtremeValues,
  WeatherWindow,
  JointOccurence
} from '@/components/metocean'

export default {
  components: { GraphLine, TimeSeries, RosePlot, ExtremeValues, WeatherWindow, JointOccurence },
  
  computed: {
    ...mapGetters(['colors', 'user', 'activePointDataPerDataset', 'getActiveRasterLayer', 'activeRasterData', 'activeSummary']),
    datasets() {
      const activePointData = this.activePointDataPerDataset;
      const result = Object.keys(activePointData).map((pointId) =>
        _.get(activePointData, [pointId][0])
      );
      return flatten(result);
    },
    hasSerieData() {
      if (_.get(this.datasets, '[0].type') === 'images') {
        return _.get(this.datasets, '[0].imageUrl');
      } else {
        return _.get(this.datasets, '[0].serie') && _.get(this.datasets, '[0].serie').length > 0;
      }
    }
  },
  
  mounted() {
    setTimeout(this.updateLocationPanel, 3000);
    this.expandedDatasets = [...Array(this.datasets.length).keys()];
  },

  methods: {
    ...mapMutations(['clearActiveLocationIds', 'setActiveLocationIds']),
    ...mapActions(['loadPointDataForLocation']),
    updateLocationPanel() {
      const { datasetIds, locationId } = this.$route.params;
      console.log('Inside updateLocationPanel:', { datasetIds, locationId });
      this.setActiveLocationIds([locationId]);
      // this.loadPointDataForLocation({ datasetIds, locationId });
    },
    close() {
      this.$router.push({
        path: `/data/${this.$route.params.datasetIds}`,
        params: { datasetIds: this.$route.params.datasetIds }
      });
    }
  }
};
</script>

<style lang="css" scoped>
.disclaimer {
  text-align: center;
}
.chart {
  height: 500px;
}
</style>
