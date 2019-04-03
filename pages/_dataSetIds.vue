<template>
  <nuxt-child />
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  mounted() {
    const { datasetIds } = this.$route.params
    this.loadLocationsInDatasets(datasetIds)
  },
  destroyed() {
    this.clearActiveDatasetIds()
  },
  methods: {
    ...mapActions('map', ['loadLocationsInDatasets']),
    ...mapMutations('map', ['clearActiveDatasetIds']),
  },
}
</script>

<style></style>
