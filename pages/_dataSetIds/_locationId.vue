<template>
  <aside class="location-id">
    <header class="location-id__header">
      <h2 class="h2">Timeseries</h2>
      <button-icon @click="close"><icon-cross /></button-icon>
    </header>
    <section class="location-id__graphs">
      <GraphLine
        v-for="(data, index) in datasets"
        :key="index"
        :category="data.category"
        :series="[data.serie]"
        :title="data.title"
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
import ButtonIcon from '~/components/button-icon'
import IconCross from '~/assets/icon-action-cross.svg'

export default {
  middleware: 'load-location-id',
  components: { GraphLine, ButtonIcon, IconCross },
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
  },
  mounted() {
    const { datasetIds, locationId } = this.$route.params
    this.loadPointDataForLocation({ datasetIds, locationId })
  },
  destroyed() {
    this.clearActiveLocationIds()
  },
  methods: {
    ...mapActions('map', ['loadPointDataForLocation']),
    ...mapMutations('map', ['clearActiveLocationIds']),
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
  overflow-y: scroll;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-background);
  box-shadow: var(--shadow);
}

.location-id__header {
  padding: var(--spacing-default);
  display: flex;
  justify-content: space-between;
}
</style>
