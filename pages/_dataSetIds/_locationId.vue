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
    />
  </section>
</template>

<script>
import isArray from 'lodash/isArray'
import negate from 'lodash/negate'
import flatten from 'lodash/flatten'
import get from 'lodash/fp/get'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import GraphLine from '~/components/graph-line'

export default {
  components: { GraphLine },
  computed: {
    ...mapGetters('map', ['activePointDataPerDataSet']),
    ...mapState({ activeTheme: state => state.preferences.theme.active }),
    dataSets() {
      const result = Object.keys(this.activePointDataPerDataSet).map(
        pointId => {
          const dataSetIds = Object.keys(
            this.activePointDataPerDataSet[pointId],
          )
          const result = dataSetIds
            .map(dataSetId =>
              get(`${pointId}.${dataSetId}`, this.activePointDataPerDataSet),
            )
            .filter(value => !!value)
          return result
        },
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
