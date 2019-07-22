<template>
  <div class="datasetids">
    <nuxt-child v-if="$route.params.locationId" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  middleware: 'load-dataset-ids',
  mounted() {
    const { datasetIds } = this.$route.params
    if (datasetIds) {
      this.storeActiveDatasets(datasetIds)
    }
  },
  methods: {
    ...mapActions('map', [
      'storeActiveDatasets',
      'loadLocationsInDatasets',
      'loadPointDataForLocation',
    ]),
  },
}
</script>

<style></style>
