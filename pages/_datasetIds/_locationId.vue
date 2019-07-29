<template>
  <aside class="location-id scrollbar">
    <header class="location-id__header">
      <h2 class="h2">{{ location }}</h2>
      <ui-button-icon @click="close"><icon-cross /></ui-button-icon>
    </header>
    <section class="location-id__graphs">
      <GraphLine
        v-for="(data, index) in datasets"
        :key="index"
        :category="data.category"
        :series="[data.serie]"
        :title="data.datasetName"
        :theme="activeTheme"
        :collapsible="true"
      />
    </section>
  </aside>
</template>

<script>
import flatten from 'lodash/flatten'
import get from 'lodash/fp/get'
import identity from 'lodash/identity'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import GraphLine from '~/components/graph-line'
import UiButtonIcon from '~/components/ui-button-icon'
import IconCross from '~/assets/icon-action-cross.svg'

export default {
  middleware: 'load-location-id',
  components: { GraphLine, UiButtonIcon, IconCross },
  computed: {
    ...mapGetters('map', ['activePointDataPerDataset']),
    ...mapState({ activeTheme: state => state.preferences.theme.active }),
    datasets() {
      const activePointData = this.activePointDataPerDataset

      // prettier-ignore
      const result = Object.keys(activePointData)
        .map(pointId =>
            Object.keys(activePointData[pointId])
              .map(datasetId => get(`${pointId}.${datasetId}`, activePointData))
              .filter(identity)
        )
      return flatten(result)
    },
    locations() {
      const { locationId } = this.$route.params
      return locationId
    },
  },
  mounted() {
    const { datasetIds, locationId } = this.$route.params
    this.location = locationId
    this.setActiveLocationIds([locationId])
    this.loadPointDataForLocation({ datasetIds, locationId })
  },
  destroyed() {
    this.clearActiveLocationIds()
  },
  methods: {
    ...mapActions('map', ['loadPointDataForLocation']),
    ...mapMutations('map', ['clearActiveLocationIds', 'setActiveLocationIds']),
    close() {
      const { datasetIds } = this.$route.params
      this.$router.push({ name: 'datasetIds', params: { datasetIds } })
    },
  },
}
</script>

<style>
.location-id {
  width: 50vw;
  max-width: 600px;
  height: 100vh;
  position: absolute;
  top: 0;
  left: var(--site-nav-width-collapsed);
  background-color: var(--color-background);
  box-shadow: var(--shadow);
  overflow-x: hidden;
}

.location-id__header {
  padding: var(--spacing-default);
  padding-right: 0;
  display: flex;
  justify-content: space-between;
}
</style>
