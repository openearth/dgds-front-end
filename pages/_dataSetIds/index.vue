<template>
  <section></section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted() {
    const { dataSetIds } = this.$route.params
    this.loadLocationsInDataSets(dataSetIds)
  },
  methods: {
    ...mapActions('map', ['loadLocationsInDataSets']),
  },
}
</script>

<style></style>
