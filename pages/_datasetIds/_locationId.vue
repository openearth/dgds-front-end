<template>
  <aside class="location-id scrollbar">
    <header class="location-id__header">
      <h2 class="h2">
        {{ locations }}
      </h2>
      <ui-button-icon @click="close">
        <icon name="cross" />
      </ui-button-icon>
    </header>
    <section class="location-id__graphs">
      <GraphLine
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
      />
    </section>
  </aside>
</template>

<script>
import flatten from 'lodash/flatten'
import { mapState, mapMutations, mapGetters } from 'vuex'
import _ from 'lodash'
import GraphLine from '~/components/graph-line'
import UiButtonIcon from '~/components/ui-button-icon'
import Icon from '~/components/icon'

export default {
  middleware: 'load-location-id',
  components: { GraphLine, UiButtonIcon, Icon },
  computed: {
    ...mapGetters('map', ['activePointDataPerDataset']),
    ...mapState({ activeTheme: state => state.preferences.theme.active }),
    datasets () {
      const activePointData = this.activePointDataPerDataset

      // prettier-ignore
      const result = Object.keys(activePointData)
        .map(pointId => _.get(activePointData, [pointId][0]))
      return flatten(result)
    },
    locations () {
      const { locationId } = this.$route.params
      return locationId
    }
  },
  mounted () {
    const { locationId } = this.$route.params
    this.location = locationId
    this.setActiveLocationIds([locationId])
  },
  destroyed () {
    this.clearActiveLocationIds()
  },
  methods: {
    ...mapMutations('map', ['clearActiveLocationIds', 'setActiveLocationIds']),
    close () {
      const { datasetIds } = this.$route.params
      this.$router.push({ name: 'datasetIds', params: { datasetIds } })
    }
  }
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
  padding-left: var(--spacing-small);
  padding-top: var(--spacing-small);

  display: flex;
  justify-content: space-between;
}
</style>
