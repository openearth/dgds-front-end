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
              Extreme values
            </v-expansion-panel-header>
            <v-expansion-panel-content color="background">
              <extreme-values />
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import _ from 'lodash'
import flatten from 'lodash/flatten'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import GraphLine from '@/components/GraphLine'

import {
  TimeSeries,
  RosePlot,
  ExtremeValues,
  WeatherWindow
} from '@/components/metocean'

export default {
  components: { GraphLine, TimeSeries, RosePlot, ExtremeValues, WeatherWindow },
  setup(props, { root }) {
    const option = ref({
      title: {
        text: 'Traffic Sources',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines']
      },
      series: [
        {
          name: 'Traffic Sources',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: 'Direct' },
            { value: 310, name: 'Email' },
            { value: 234, name: 'Ad Networks' },
            { value: 135, name: 'Video Ads' },
            { value: 1548, name: 'Search Engines' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      backgroundColor: 'transparent'
    })

    const expandedDatasets = ref([])
    const activePointDataPerDataset = computed(() => root.$store.getters.activePointDataPerDataset)
    const getActiveRasterLayer = computed(() => root.$store.getters.getActiveRasterLayer)
    const activeRasterData = computed(() => root.$store.getters.activeRasterData)
    const activeSummary = computed(() => root.$store.getters.activeSummary)

    const datasets = computed(() => {
      const activePointData = activePointDataPerDataset.value
      const result = Object.keys(activePointData).map(pointId =>
        _.get(activePointData, [pointId][0])
      )
      return flatten(result)
    })

    const hasSerieData = computed(() => {
      if (_.get(datasets.value, '[0].type') === 'images') {
        return _.get(datasets.value, '[0].imageUrl')
      } else {
        return (
          _.get(datasets.value, '[0].serie') &&
          _.get(datasets.value, '[0].serie').length > 0
        )
      }
    })

    const locations = computed(() => root.$route.params.locationId)
    const getTimeStep = computed(() => {
      const date = _.get(activeRasterData.value, 'date')
      if (date) {
        return date
      } else {
        return ''
      }
    })

    const activeSummaryId = computed(() => {
      let summary = ''
      if (activeSummary.value.length === 2) {
        summary =
          activeSummary.value[0].chosenValue +
          '_' +
          activeSummary.value[1].chosenValue
      } else {
        summary = activeSummary.value.length
      }
      return summary
    })

    watch(() => root.$route.params.locationId, () => {
      updateLocationPanel()
    })

    watch(() => root.$route.params.datasetIds, () => {
      updateLocationPanel()
    })

    watch(activePointDataPerDataset, () => {
      expandedDatasets.value = []
    })

    watch(activeSummary, {
      handler() {
        updateLocationPanel()
      },
      deep: true
    })

    onMounted(() => {
      setTimeout(updateLocationPanel, 3000)
      expandedDatasets.value = [...Array(datasets.value.length).keys()]
    })

    onUnmounted(() => {
      clearActiveLocationIds()
    })

    const { loadPointDataForLocation, clearActiveLocationIds, setActiveLocationIds } = mapMutations(['clearActiveLocationIds', 'setActiveLocationIds'])

    const updateLocationPanel = () => {
      const { datasetIds, locationId } = root.$route.params
      setActiveLocationIds([locationId])
      loadPointDataForLocation({ datasetIds, locationId })
    }

    const close = () => {
      root.$router.push({
        path: `/data/${root.$route.params.datasetIds}`,
        params: { datasetIds: root.$route.params.datasetIds }
      })
    }

    return {
      option,
      expandedDatasets,
      datasets,
      hasSerieData,
      locations,
      getTimeStep,
      activeSummaryId,
      updateLocationPanel,
      close
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