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
      @toggle-location-dataset="toggleLocationDataset"
    />
    <TimeStamp
      v-show="activeTimestamp !== ''"
      class="default-layout__timestamp"
      :timestamp="activeTimestamp"
    />
    <div style="position: absolute; bottom: 2rem; right: 3rem;">
      <select @change="setActive">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    <nuxt />
    <SiteNavigation class="default-layout__site-navigation" />
  </div>
</template>

<script>
import head from 'lodash/head'
import includes from 'lodash/fp/includes'
import pipe from 'lodash/fp/pipe'
import split from 'lodash/fp/split'
import join from 'lodash/fp/join'
import filter from 'lodash/fp/filter'
import update from 'lodash/fp/update'
import negate from 'lodash/fp/negate'
import concat from 'lodash/fp/concat'
import isEqual from 'lodash/fp/isEqual'
import identity from 'lodash/fp/identity'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import DataSetControlMenu from '../components/data-set-control-menu'
import SiteNavigation from '../components/site-navigation'
import TimeStamp from '../components/time-stamp'
import { when } from '../lib/utils'

export default {
  components: { SiteNavigation, DataSetControlMenu, TimeStamp },
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active,
    }),
    ...mapGetters('map', [
      'activeSpatialData',
      'activeDatasetsLocations',
      'datasetsInActiveTheme',
      'activeTimestamp',
    ]),
    mapboxOptions() {
      return {
        tiles: this.activeSpatialData,
        sources: this.activeDatasetsLocations,
        style: this.activeTheme,
      }
    },
  },
  watch: {
    $route: {
      handler(routeObj) {
        if (routeObj.params.datasetIds === undefined) {
          this.clearActiveDatasetIds()
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('map', ['loadPointDataForLocation']),
    ...mapMutations('map', ['clearActiveDatasetIds']),
    ...mapMutations({ setActiveTheme: 'preferences/theme/setActive' }),
    loadLocations({ detail }) {
      const locationIds = detail.map(feature => feature.properties.locationId)
      const locationId = head(locationIds)
      const { datasetIds } = this.$route.params
      this.loadPointDataForLocation({ datasetIds, locationId })
    },
    selectLocations({ detail }) {
      const { datasetIds } = this.$route.params
      const locationIds = detail.map(feature => feature.properties.locationId)

      this.updateRoute({
        name: 'datasetIds-locationId',
        params: { datasetIds, locationId: head(locationIds) },
      })
    },
    setActive(event) {
      this.setActiveTheme(event.target.value)
    },
    toggleLocationDataset(id) {
      const addId = value => concat(value, id)
      const removeId = filter(negate(isEqual(id)))
      const toggleIdDatasets = pipe([
        split(','),
        when(includes(id), removeId, addId),
        filter(identity),
        join(','),
        when(isEqual(''), () => undefined, identity),
      ])

      const newRouteObject = update(
        'params.datasetIds',
        toggleIdDatasets,
        this.$route,
      )
      this.updateRoute(newRouteObject)
    },
    updateRoute(routeObj) {
      const { datasetIds, locationId } = routeObj.params

      if (datasetIds === undefined && locationId !== undefined) {
        routeObj = update('params.locationId', () => undefined, routeObj)
      }

      this.$router.push(routeObj)
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
  max-height: calc(100vh - var(--spacing-large) - var(--map-controls-height));
}

.default-layout__site-navigation {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
}

.default-layout__timestamp {
  position: relative;
  left: var(--spacing-default);
  bottom: calc(var(--spacing-default) + 50px);
  width: 15vw;
  height: 50px;
}
</style>
