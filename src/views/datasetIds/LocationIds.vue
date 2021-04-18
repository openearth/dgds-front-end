<template>
  <div>
  </div>
</template>

<script>
export default {
  watch: {
    '$route' () {
      console.log('change in locationIds', this.$route.params.locationIds, this.$route)
    }
  },
  mounted () {
    console.log('mounted locationIds', this.$route.params.locationIds, this.$route)
  }
}
</script>

<style lang="css" scoped></style>
