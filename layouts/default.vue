<template>
  <div class="default-layout" style="position: relative;">
    <div id="map" v-mapbox="mapboxOptions" />
    <div style="position: absolute; top: 0; left: 0;">
      <nuxt-link to="/set1">set1</nuxt-link
      ><nuxt-link to="/set2">set2</nuxt-link>
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
    ...mapGetters('map', ['activeDataSets']),
    mapboxOptions() {
      return {
        sources: this.activeDataSets,
        style: this.activeTheme,
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
