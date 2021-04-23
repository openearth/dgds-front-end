<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  watch: {
    '$route.params.datasetIds' () {
      this.storeActiveVectorIds(this.$route.params.datasetIds)
      this.triggerActiveVector()
    }
  },
  mounted () {
    this.storeActiveVectorIds(this.$route.params.datasetIds)
  },
  methods: {
    ...mapActions(['storeActiveVectorIds', 'triggerActiveVector'])
  }
}
</script>

<style lang="css" scoped></style>
