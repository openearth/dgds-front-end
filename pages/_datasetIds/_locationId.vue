<template>
  <ui-tray class="location" @on-close="close">
    <template v-slot:header>
      <h2 class="h3">
        {{ locations }}
      </h2>
    </template>
    <template v-slot:body>
      <template v-if="hasSerieData">
        <graph-line
          v-for="(data, index) in datasets"
          :key="index"
          :image-url="data.imageUrl"
          :category="data.category"
          :series="[data.serie]"
          :title="data.datasetName"
          :theme="activeTheme"
          :collapsible="true"
          :units="data.units"
          :type="data.type"
          :parameter-id="data.id"
          :set-mark-point="data.id === getActiveRasterLayer"
          :time-step="getTimeStep"
        />
      </template>
      <template v-else>
        <p>No data available.</p>
      </template>
    </template>
    <template v-slot:footer>
      <p class="bodytext-xs disclaimer-message">
        Global datasets are generated with great care but may locally contain inaccuracies. See the
        dataset descriptions for more information.
      </p>
    </template>
  </ui-tray>
</template>

<script>
  import _ from 'lodash'
  import flatten from 'lodash/flatten'
  import { mapState, mapMutations, mapGetters } from 'vuex'
  import GraphLine from '../../components/graph-line'
  import UiTray from '../../components/ui-tray'

  export default {
    components: { GraphLine, UiTray },
    computed: {
      ...mapGetters('map', [
        'activePointDataPerDataset',
        'getActiveRasterLayer',
        'activeRasterData',
      ]),
      ...mapState('preferences', ['theme']),
      activeTheme() {
        return this.theme.active
      },
      datasets() {
        const activePointData = this.activePointDataPerDataset
        const result = Object.keys(activePointData).map(pointId =>
          _.get(activePointData, [pointId][0]),
        )

        return flatten(result)
      },
      hasSerieData() {
        if (_.get(this.datasets, '[0].type') === 'images') {
          return _.get(this.datasets, '[0].imageUrl')
        } else {
          return _.get(this.datasets, '[0].serie') && _.get(this.datasets, '[0].serie').length > 0
        }
      },
      locations() {
        return this.$route.params.locationId
      },
      getTimeStep() {
        const date = _.get(this.activeRasterData, 'date')
        if (date) {
          return date
        } else {
          return ''
        }
      },
    },
    mounted() {
      const { datasetIds, locationId } = this.$route.params
      this.location = locationId
      this.setActiveLocationIds([locationId])
      this.$store.dispatch('map/loadPointDataForLocation', { datasetIds, locationId })
    },
    destroyed() {
      this.clearActiveLocationIds()
    },
    methods: {
      ...mapMutations('map', ['clearActiveLocationIds', 'setActiveLocationIds']),
      close() {
        this.$router.push({
          name: 'datasetIds',
          params: { datasetIds: this.$route.params.datasetIds },
        })
      },
    },
  }
</script>

<style>
  .location {
    left: var(--nav-bar-width);
  }

  .default-layout--sidebar-animating .location {
    transition: left 0.35s ease;
  }

  .default-layout--sidebar-expanded .location {
    left: var(--nav-bar-expanded-width);
  }

  .disclaimer-message {
    text-align: center;
  }
</style>
