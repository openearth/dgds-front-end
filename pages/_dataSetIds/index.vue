<template>
  <section></section>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  mounted() {
    const { dataSetIds } = this.$route.params
    this.loadLocationsInDataSets(dataSetIds)
  },
  destroyed() {
    this.clearActiveDataSetIds()
  },
  methods: {
    ...mapActions('map', ['loadLocationsInDataSets']),
    ...mapMutations('map', ['clearActiveDataSetIds']),
  },
}
</script>

<style></style>
