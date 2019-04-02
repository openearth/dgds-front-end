<template>
  <div></div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  mounted() {
    const { dataSetIds, locationId } = this.$route.params
    this.loadTimeseriesDataForLocation({ dataSetIds, locationId })
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
