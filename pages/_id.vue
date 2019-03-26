<template>
  <div style="position: relative;">
    <div
      id="map"
      v-mapbox="{ sources: sources, style: style }"
      @load="fetchData"
    />
    <div style="position: absolute; top: 0; left: 0;">
      <select @change="changeStyle">
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    id: null,
    sources: [],
    style: 'dark',
  }),
  mounted() {
    this.id = this.$route.params.id
  },
  methods: {
    fetchData() {
      fetch(`http://localhost:3001/api/v1/geojson/1`)
        .then(response => response.json())
        .then(geojson => this.sources.push(geojson))
        .then(() => {
          setTimeout(() => {
            fetch(`http://localhost:3001/api/v1/geojson/2`)
              .then(response => response.json())
              .then(geojson => this.sources.push(geojson))
          }, 2000)
        })
    },
    changeStyle(event) {
      this.style = event.target.value
    },
  },
}
</script>

<style>
#map {
  margin: 0 auto;
  min-height: 100vh;
}
</style>
