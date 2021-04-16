<template>
  <div>
  </div>
</template>

<script>
export default {
  watch: {
    '$route.params.locationIds' () {
      console.log('change in locationIds', this.$route.params.locationIds)
    }
  },
  mounted () {
    console.log('mounted locationIds', this.$route.params.locationIds)
  }
}
</script>

<style lang="css" scoped></style>
