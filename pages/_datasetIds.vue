<template>
  <nuxt-child v-if="$route.params.locationId" :key="$route.params.locationId" />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  transition: 'slide',
  mounted () {
    const { datasetIds } = this.$route.params
    if (datasetIds) {
      this.storeActiveDatasets(datasetIds)
    }
  },
  methods: {
    ...mapActions('map', ['storeActiveDatasets', 'loadLocationsInDatasets'])
  }
}
</script>
