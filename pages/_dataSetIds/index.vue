<template>
  <section></section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted() {
    const { dataSetIds } = this.$route.params
    this.loadDataSetsById(dataSetIds)
  },
  methods: {
    ...mapActions('map', ['loadDataSetsById']),
  },
}
</script>

<style></style>
