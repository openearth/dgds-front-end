<template>
  <div class="default-layout" style="position: relative;">
    <no-ssr>
      <v-mapbox
        id="map"
        ref="map"
        :access-token="mapboxAccessToken"
        map-style="mapbox://styles/global-data-viewer/cjtss3jfb05w71fmra13u4qqm"
      >
        <v-mapbox-navigation-control
          position="bottom-right"
        ></v-mapbox-navigation-control>
        <v-mapbox-layer-clickable
          v-for="layer in vectorLayers"
          :key="layer.id"
          :layer="layer"
          :active-theme="activeTheme"
          @select-locations="selectLocations"
        ></v-mapbox-layer-clickable>
        <v-mapbox-raster-layer :options="spatialLayer"> </v-mapbox-raster-layer>
      </v-mapbox>
    </no-ssr>
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
    <nuxt />
    <SiteNavigation class="default-layout__site-navigation" />
  </div>
</template>

<script>
import map from 'lodash/fp/map'
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
import getVectorLayer from '../lib/mapbox/layers/get-vector-layer'
import getSpatialLayer from '../lib/mapbox/layers/get-spatial-layer'
import VMapboxLayerClickable from '../components/v-mapbox-components/v-mapbox-layer-clickable'
import VMapboxRasterLayer from '../components/v-mapbox-components/v-mapbox-raster-layer'

export default {
  components: {
    SiteNavigation,
    DataSetControlMenu,
    TimeStamp,
    VMapboxLayerClickable,
    VMapboxRasterLayer,
  },
  data: () => ({
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
    locationsLayers: [],
    activeLocation: null,
  }),
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active,
      activeLocationIds: state => state.map.activeLocationIds,
    }),
    ...mapGetters('map', [
      'activeSpatialData',
      'allVectorData',
      'activeDatasetsLocations',
      'datasetsInActiveTheme',
      'activeTimestamp',
      'activeDatasets',
    ]),
    spatialLayer() {
      const spatialLayer = getSpatialLayer().get(map)
      spatialLayer.source.tiles = this.activeSpatialData
      return spatialLayer
    },
    vectorLayers() {
      const vectorLayers = this.allVectorData
      const defaultVectorLayer = getVectorLayer()
      vectorLayers.forEach(layer => {
        if (!layer.paint) {
          layer.paint = defaultVectorLayer.paint
        }
      })
      return vectorLayers
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
  async mounted() {
    await this.$nextTick()
    const map = this.$refs.map.map
    map.on('load', () => {
      // console.log('loading')
      // this.locationsLayers = getVectorLayer()
    })
  },
  methods: {
    ...mapActions('map', ['loadPointDataForLocation']),
    ...mapMutations('map', ['clearActiveDatasetIds']),
    // loadLocations({ detail }) {
    //   console.log('detail', detail)
    //   const locationIds = detail.map(feature => feature.properties.locationId)
    //   const locationId = head(locationIds)
    //   const { datasetIds } = this.$route.params
    //   this.loadPointDataForLocation({ datasetIds, locationId })
    // },
    selectLocations(detail) {
      const { datasetIds } = this.$route.params
      const locationIds = detail.map(feature => feature.properties.locationId)
      this.updateRoute({
        name: 'datasetIds-locationId',
        params: { datasetIds, locationId: head(locationIds) },
      })
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

.default-layout .mapboxgl-ctrl-bottom-left {
  left: var(--site-nav-width-collapsed);
  z-index: 0;
}
</style>
