<template>
  <div class="default-layout" style="position: relative;">
    <div
      id="map"
      v-mapbox="mapboxOptions"
      @load-locations="loadLocations"
      @select-locations="selectLocations"
    />
    <DataSetControlMenu
      class="default-layout__data-set-control-menu"
      :datasets="datasetsInActiveTheme"
    />
    <div style="position: absolute; top: 0; left: 0;">
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/wl">WL</nuxt-link>
    </div>
    <div style="position: absolute; bottom: 2rem; right: 3rem;">
      <select @change="setActive">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    <nuxt />
  </div>
</template>

<script>
import head from 'lodash/head'
import { mapState, mapGetters, mapActions } from 'vuex'
import DataSetControlMenu from '../components/data-set-control-menu'

export default {
  components: { DataSetControlMenu },
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active,
    }),
    ...mapGetters('map', ['activeDatasetsLocations', 'datasetsInActiveTheme']),
    mapboxOptions() {
      return {
        sources: this.activeDatasetsLocations,
        style: this.activeTheme,
      }
    },
  },
  methods: {
    ...mapActions('map', ['loadPointDataForLocation']),
    loadLocations({ detail }) {
      const locationIds = detail.map(feature => feature.properties.locationId)
      const locationId = head(locationIds)
      const { datasetIds } = this.$route.params
      this.loadPointDataForLocation({ datasetIds, locationId })
    },
    selectLocations({ detail }) {
      const { datasetIds } = this.$route.params
      const locationIds = detail.map(feature => feature.properties.locationId)

      this.$router.push({
        name: 'datasetIds-locationId',
        params: { datasetIds, locationId: head(locationIds) },
      })
    },
    setActive(event) {
      this.$store.commit('preferences/theme/setActive', event.target.value)
    },
  },
}
</script>

<style>
.default-layout {
  width: 100vw;
  height: 100vh;

  --map-controls-height: 122px;
}

#map {
  width: 100%;
  height: 100%;
}

.default-layout__data-set-control-menu {
  position: absolute;
  top: var(--spacing-default);
  right: var(--spacing-default);
  max-width: 20rem;
  width: 100%;
  max-height: calc(100vh - var(--spacing-double) - var(--map-controls-height));
}
</style>
