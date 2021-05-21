<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  watch: {
    '$route.params.datasetIds': {
      handler () {
        this.storeActiveVectorIds(this.$route.params.datasetIds)
        this.triggerActiveVector()
      },
      deep: true
    }
  },
  mounted () {
    this.storeActiveVectorIds(this.$route.params.datasetIds)
    this.triggerActiveVector()
  },
  methods: {
    ...mapActions(['storeActiveVectorIds', 'triggerActiveVector'])
  }
}
</script>

<style lang="css" scoped></style>
