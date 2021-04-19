<template>
  <div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  watch: {
    '$route.params.datasetIds' () {
      this.storeActiveDatasets(this.$route.params.datasetIds)
    }
  },
  mounted () {
    this.storeActiveDatasets(this.$route.params.datasetIds)
  },
  methods: {
    ...mapActions(['storeActiveDatasets'])
  }
}
</script>

<style lang="css" scoped></style>
