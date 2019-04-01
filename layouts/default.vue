<template>
  <div class="default-layout" style="position: relative;">
    <div
      id="map"
      v-mapbox="mapboxOptions"
      @select-locations="selectLocations"
    />
    <div style="position: absolute; top: 0; left: 0;">
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/wl">WL</nuxt-link>
    </div>
    <nuxt />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active,
    }),
    ...mapGetters('map', ['activeDataSetsLocations']),
    mapboxOptions() {
      return {
        sources: this.activeDataSetsLocations,
        style: this.activeTheme,
      }
    },
  },
  methods: {
    selectLocations({ detail }) {
      const currentPath = this.$route.fullPath
      const locationIds = detail.map(feature => feature.properties.locationId)

      if (this.$route.name !== 'dataSetIds-locationIds') {
        this.$router.push(`${currentPath}/${locationIds}`)
      }
    },
  },
}
</script>

<style>
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.default-layout {
  width: 100vw;
  height: 100vh;
}

#map {
  width: 100%;
  height: 100%;
}
</style>
