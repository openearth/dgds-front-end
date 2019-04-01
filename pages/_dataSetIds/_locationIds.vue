<template>
  <div></div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  mounted() {
    const { locationIds } = this.$route.params
    this.loadTimeseriesDataForLocation(locationIds)
  },
  destroyed() {
    this.clearActiveLocationIds()
  },
  methods: {
    ...mapActions('map', ['loadTimeseriesDataForLocation']),
    ...mapMutations('map', ['clearActiveLocationIds']),
  },
}
</script>
