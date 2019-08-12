<template>
  <div class="default-layout" style="position: relative;">
    <no-ssr>
      <v-mapbox
        id="map"
        ref="map"
        :access-token="mapboxAccessToken"
        map-style="mapbox://styles/global-data-viewer/cjtss3jfb05w71fmra13u4qqm"
        :pitch="10"
        :bearing="10"
      >
        <v-mapbox-navigation-control
          position="bottom-right"
        ></v-mapbox-navigation-control>
        <v-mapbox-selected-point-layer
          :geometry="geometry"
        ></v-mapbox-selected-point-layer>
        <v-mapbox-vector-layer
          v-for="vectorlayer in vectorLayers"
          :key="vectorlayer.id"
          :layers="vectorlayer"
          :active-theme="activeTheme"
          @select-locations="selectLocations"
        ></v-mapbox-vector-layer>
        <v-mapbox-raster-layer :options="rasterLayer"> </v-mapbox-raster-layer>
      </v-mapbox>
    </no-ssr>
    <DataSetControlMenu
      class="default-layout__data-set-control-menu"
      :datasets="datasetsInActiveTheme"
      @toggle-location-dataset="toggleLocationDataset"
      @toggle-raster-layer="setActiveRasterLayer"
    />
    <TimeStamp
      v-show="activeTimestamp !== ''"
      class="default-layout__timestamp"
      :timestamp="activeTimestamp"
    />
    <nuxt />
    <SiteNavigation
      class="default-layout__site-navigation"
      @change-theme="changeTheme"
    />
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
import _ from 'lodash'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import DataSetControlMenu from '../components/data-set-control-menu'
import SiteNavigation from '../components/site-navigation'
import TimeStamp from '../components/time-stamp'
import { when } from '../lib/utils'
import getVectorLayer from '../lib/mapbox/layers/get-vector-layer'
import getRasterLayer from '../lib/mapbox/layers/get-raster-layer'
import VMapboxVectorLayer from '../components/v-mapbox-components/v-mapbox-vector-layer'
import VMapboxRasterLayer from '../components/v-mapbox-components/v-mapbox-raster-layer'
import VMapboxSelectedPointLayer from '../components/v-mapbox-components/v-mapbox-selected-point-layer'

export default {
  components: {
    SiteNavigation,
    DataSetControlMenu,
    TimeStamp,
    VMapboxVectorLayer,
    VMapboxRasterLayer,
    VMapboxSelectedPointLayer,
  },
  data: () => ({
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
    locationsLayers: [],
    activeLocation: null,
    geometry: {
      type: 'Point',
      coordinates: [],
    },
  }),
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active,
      activeLocationIds: state => state.map.activeLocationIds,
    }),
    ...mapGetters('map', [
      'activeRasterData',
      'activeVectorData',
      'activeDatasetsLocations',
      'datasetsInActiveTheme',
      'activeTimestamp',
      'activeDatasets',
      'getActiveTheme',
    ]),
    rasterLayer() {
      const rasterLayer = getRasterLayer()
      rasterLayer.source.tiles = this.activeRasterData
      return rasterLayer
    },
    vectorLayers() {
      console.log('Ok, even de vectorlayers checken')
      // Returns an array with unique mapboxlayers.

      // Get active vectorlayers and flatten, all mapboxlayers into 1 array
      const vectorLayers = _.flatten(this.activeVectorData)

      // Get Default vector mapboxlayer
      const defaultVectorLayer = getVectorLayer()
      // get all unique layerIds
      const layerIds = vectorLayers.map(layer => layer.id)
      const uniqueLayerIds = _.uniq(layerIds)

      // for each layer id merge the mapboxlayers that have that id
      const newLayers = uniqueLayerIds.map(id => {
        const groupedLayers = vectorLayers.filter(layer => layer.id === id)
        const flattenedLayers = _.flatten(groupedLayers)
        const merged = _(flattenedLayers)
          .groupBy('id')
          .map(g =>
            _.mergeWith({}, ...g, (obj, src) =>
              _.isArray(obj) ? obj.concat(src) : undefined,
            ),
          )
          .value()

        merged.forEach(layer => {
          // if no paint is defined add default paint
          if (!layer.paint) {
            layer.paint = defaultVectorLayer.paint
          }

          // if there is a filterIds, concatenate the values into filter
          if (_.get(layer, 'filterIds')) {
            const filter = ['any']
            layer.filterIds.forEach(id => {
              filter.push(['==', ['get', id], true])
            })
            layer.filter = filter
          }
        })
        console.log(
          'for every id: ',
          id,
          'we have  a pretty array: ',
          merged,
          '😪',
        )
        return merged
      })
      console.log(
        'this.activeVectorData',
        this.activeVectorData,
        'newLayers',
        newLayers,
      )
      return newLayers
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
  },
  methods: {
    ...mapActions('map', ['loadPointDataForLocation']),
    ...mapMutations('map', ['clearActiveDatasetIds', 'setActiveRasterLayer']),
    selectLocations(detail) {
      this.geometry = detail.geometry
      const { datasetIds } = this.$route.params
      const locationIds = detail.features.map(
        feature =>
          feature.properties.locationId || feature.properties.Transect_id,
      )
      this.updateRoute({
        name: 'datasetIds-locationId',
        params: { datasetIds, locationId: head(locationIds) },
      })
    },
    toggleLocationDataset(id) {
      console.log('yes we made it to toggleLocationDataset: ', id)
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
    changeTheme() {
      // When new theme is chosen update the route with the datasets within
      // this theme
      const datasets = this.getActiveTheme.datasets
      let newparams
      if (datasets) {
        newparams = datasets.join(',')
      }
      const newRouteObject = this.$route
      newRouteObject.params.datasetIds = newparams
      this.updateRoute(newRouteObject)
    },
    updateRoute(routeObj) {
      console.log('hoi anna, we zijn in updateroute aangekomen', routeObj)
      const { datasetIds, locationId } = routeObj.params
      if (datasetIds === undefined) {
        this.geometry = {
          type: 'Point',
          coordinates: [],
        }
      }
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
