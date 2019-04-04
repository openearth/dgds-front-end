<template>
  <div class="datasetids">
    <nuxt-child v-if="$route.params.locationId" />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  middleware: 'load-dataset-ids',
  mounted() {
    const { datasetIds } = this.$route.params
    if (datasetIds) {
      this.loadLocationsInDatasets(datasetIds)
    }
  },
  destroyed() {
    this.clearActiveDatasetIds()
  },
  methods: {
    ...mapActions('map', [
      'loadLocationsInDatasets',
      'loadPointDataForLocation',
    ]),
    ...mapMutations('map', ['clearActiveDatasetIds']),
  },
}
</script>

<style></style>
