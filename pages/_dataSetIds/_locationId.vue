<template>
  <section class="timeseries">
    <GraphLine
      v-for="(data, index) in dataSets"
      :key="index"
      class="graphs"
      :category="data.category"
      :series="[data.serie]"
      :title="data.title"
      :theme="activeTheme"
      :collapsible="true"
    />
  </section>
</template>

<script>
import flatten from 'lodash/flatten'
import get from 'lodash/fp/get'
import identity from 'lodash/identity'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import GraphLine from '~/components/graph-line'

export default {
  components: { GraphLine },
  computed: {
    ...mapGetters('map', ['activePointDataPerDataSet']),
    ...mapState({ activeTheme: state => state.preferences.theme.active }),
    dataSets() {
      const activePointData = this.activePointDataPerDataSet

      // prettier-ignore
      const result = Object.keys(activePointData)
        .map(pointId =>
            Object.keys(activePointData[pointId])
              .map(dataSetId => get(`${pointId}.${dataSetId}`, activePointData))
              .filter(identity)
        )
      return flatten(result)
    },
  },
  mounted() {
    const { dataSetIds, locationId } = this.$route.params
    this.loadPointDataForLocation({ dataSetIds, locationId })
  },
  destroyed() {
    this.clearActiveLocationIds()
  },
  methods: {
    ...mapActions('map', ['loadPointDataForLocation']),
    ...mapMutations('map', ['clearActiveLocationIds']),
  },
}
</script>

<style>
.timeseries {
  width: 80vw;
  height: 80vh;
  overflow-y: scroll;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.graphs {
  width: 100%;
  height: 50%;
  margin: auto;
}
</style>
