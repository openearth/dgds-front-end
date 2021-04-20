<template>
  <v-navigation-drawer class="pl-16" permanent absolute width="40vw" color="background">
    <v-container class="account d-flex flex-column">
      <h2 class="h2">
        {{ locations }}
      </h2>
      <v-btn icon class="close-button" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="flex-grow-1 py-3 scrollbar">
        <v-expansion-panels v-if="hasSerieData" flat accordion multiple v-model="expandedDatasets">
          <v-expansion-panel
            v-for="data in datasets"
            :key="data.id"
          >
            <v-expansion-panel-header class="h4">
              {{ data.datasetName }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <graph-line
                :image-url="data.imageUrl"
                :category="data.category"
                :series="[data.serie]"
                theme="dark"
                :collapsible="true"
                :units="data.units"
                :type="data.type"
                :parameter-id="data.id"
                :title="data.datasetName"
                :set-mark-point="data.id === getActiveRasterLayer"
                :time-step="getTimeStep"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <template v-else>
          <p>No data available.</p>
        </template>
      </div>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import _ from 'lodash'
import flatten from 'lodash/flatten'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import GraphLine from '@/components/GraphLine'

export default {
  components: { GraphLine },
  data () {
    return {
      expandedDatasets: []
    }
  },
  computed: {
    ...mapGetters([
      'activePointDataPerDataset',
      'getActiveRasterLayer',
      'activeRasterData'
    ]),
    datasets () {
      const activePointData = this.activePointDataPerDataset
      const result = Object.keys(activePointData).map(pointId =>
        _.get(activePointData, [pointId][0])
      )
      return flatten(result)
    },
    hasSerieData () {
      if (_.get(this.datasets, '[0].type') === 'images') {
        return _.get(this.datasets, '[0].imageUrl')
      } else {
        return _.get(this.datasets, '[0].serie') && _.get(this.datasets, '[0].serie').length > 0
      }
    },
    locations () {
      return this.$route.params.locationId
    },
    getTimeStep () {
      const date = _.get(this.activeRasterData, 'date')
      if (date) {
        return date
      } else {
        return ''
      }
    }
  },
  watch: {
    '$route.params.locationId' () {
      this.updateLocationPanel()
    },
    activePointDataPerDataset () {
      this.expandedDatasets = [...Array(this.datasets.length).keys()]
    }
  },
  mounted () {
    this.updateLocationPanel()
    this.expandedDatasets = [...Array(this.datasets.length).keys()]
  },
  destroyed () {
    this.clearActiveLocationIds()
  },
  methods: {
    ...mapActions(['loadPointDataForLocation']),
    ...mapMutations(['clearActiveLocationIds', 'setActiveLocationIds']),
    updateLocationPanel () {
      const { datasetIds, locationId } = this.$route.params
      this.location = locationId
      this.setActiveLocationIds([locationId])
      this.loadPointDataForLocation({ datasetIds, locationId })
    },
    close () {
      this.$router.push({
        path: `/${this.$route.params.datasetIds}`,
        params: { datasetIds: this.$route.params.datasetIds }
      })
    }
  }
}
</script>

<style lang="css" scoped></style>
