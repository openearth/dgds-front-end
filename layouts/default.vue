<template>
  <div
    :class="{
      'default-layout--sidebar-animating': sidebarAnimating,
      'default-layout--sidebar-expanded': sidebarExpanded,
    }"
    class="default-layout"
  >
    <client-only>
      <v-mapbox
        id="map"
        ref="map"
        :access-token="mapboxAccessToken"
        map-style="mapbox://styles/global-data-viewer/cjtss3jfb05w71fmra13u4qqm"
        :preserve-drawing-buffer="true"
      >
        <v-mapbox-navigation-control position="bottom-right" />
        <v-mapbox-selected-point-layer :geometry="geometry" />
        <v-mapbox-info-text-layer :geometry="infoTextGeometry" :message="mapboxMessage" />
        <v-mapbox-vector-layer
          v-for="vectorLayer in vectorLayers"
          :key="vectorLayer.id"
          :name="vectorLayer.id"
          :layer="vectorLayer"
          :active-theme="activeTheme"
          @select-locations="selectLocations"
        />
        <v-mapbox-raster-layer :options="rasterLayer" @click="getFeatureInfo" />
        <v-mapbox-flowmap-layer v-if="flowmapLayerReady" :options="flowmapLayer" />
      </v-mapbox>
    </client-only>

    <data-set-control-menu
      :datasets="datasetsInActiveTheme"
      class="default-layout__data-set-control-menu"
      @toggle-location-dataset="toggleLocationDataset"
      @toggle-raster-layer="toggleRasterLayer"
    />

    <time-stamp
      v-show="activeTimestamp !== '' && getActiveRasterLayer"
      class="default-layout__timestamp"
      @update-timestep="removeInfoText"
    />

    <nuxt />

    <sidebar />

    <disclaimer-modal />
  </div>
</template>

<script>
  import head from 'lodash/head'
  import _ from 'lodash'
  import update from 'lodash/fp/update'
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import auth from '../auth'
  import DataSetControlMenu from '../components/data-set-control-menu'
  import TimeStamp from '../components/time-stamp'
  import getVectorLayer from '../lib/mapbox/layers/get-vector-layer'
  import getRasterLayer from '../lib/mapbox/layers/get-raster-layer'
  import VMapboxVectorLayer from '../components/v-mapbox-components/v-mapbox-vector-layer'
  import VMapboxRasterLayer from '../components/v-mapbox-components/v-mapbox-raster-layer'
  import VMapboxSelectedPointLayer from '../components/v-mapbox-components/v-mapbox-selected-point-layer'
  import DisclaimerModal from '../components/disclaimer-modal'
  import VMapboxInfoTextLayer from '../components/v-mapbox-components/v-mapbox-info-text-layer'
  import Sidebar from '../components/sidebar/sidebar'

  export default {
    components: {
      DataSetControlMenu,
      TimeStamp,
      VMapboxVectorLayer,
      VMapboxRasterLayer,
      VMapboxSelectedPointLayer,
      DisclaimerModal,
      VMapboxInfoTextLayer,
      Sidebar,
    },
    data: () => ({
      mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
      locationsLayers: [],
      activeLocation: null,
      geometry: {
        type: 'Point',
        coordinates: [],
      },
      infoTextGeometry: {
        type: 'Point',
        coordinates: [],
      },
      mapboxMessage: '',
    }),
    computed: {
      ...mapState('preferences', ['theme', 'sidebarAnimating', 'sidebarExpanded']),
      ...mapState('map', ['activeLocationIds']),
      ...mapGetters('map', [
        'activeRasterData',
        'activeVectorData',
        'activeDatasetsLocations',
        'datasetsInActiveTheme',
        'activeTimestamp',
        'activeDatasets',
        'getActiveTheme',
        'getActiveRasterLayer',
        'getDatasets',
        'getGeographicalScope',
      ]),
      activeTheme() {
        return this.theme.active
      },
      rasterLayer() {
        const rasterLayer = getRasterLayer()
        rasterLayer.source.tiles = [_.get(this.activeRasterData, 'url')]
        return rasterLayer
      },
      vectorLayers() {
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
          const layer = _(flattenedLayers)
            .groupBy('id')
            .map(g =>
              _.mergeWith({}, ...g, (obj, src) => (_.isArray(obj) ? obj.concat(src) : undefined)),
            )
            .value()

          const merged = _.head(layer)
          // if no paint is defined add default paint
          if (!merged.paint) {
            merged.paint = defaultVectorLayer.paint
          }
          const mergedFilter = this.updateFilter(merged)
          // Return the first and only merged object
          return mergedFilter
        })
        return newLayers
      },
    },
    watch: {
      $route: {
        handler(routeObj) {
          if (routeObj.params.datasetIds === undefined) {
            this.clearActiveDatasetIds()
          }
          if (routeObj.params.locationId === undefined) {
            this.geometry = {
              type: 'Point',
              coordinates: [],
            }
          }
        },
        deep: true,
      },
    },
    mounted() {
      auth
        .getUser()
        .then(user => {
          if (user !== null) {
            this.$store.commit('preferences/setUser', { user: user.profile })
          } else {
            this.$store.commit('preferences/setUser', { user: null })
          }
        })
        .catch(err => {
          console.log({ err })
        })
    },
    methods: {
      ...mapMutations('map', [
        'clearActiveDatasetIds',
        'setActiveRasterLayer',
        'setGeographicalScope',
      ]),
      removeInfoText() {
        this.infoTextGeometry = {
          type: 'Point',
          coordinates: [],
        }
      },
      updateFilter(layer) {
        // if there is a filterIds, concatenate the values into filter
        if (_.get(layer, 'filterIds')) {
          const filter = ['any']
          layer.filterIds.forEach(id => {
            filter.push(['==', ['get', id], true])
          })
          layer.filter = filter
        }
        return layer
      },
      zoomToBbox(datasetId) {
        const oldScope = this.getGeographicalScope
        const metadata = _.get(this.getDatasets, `[${datasetId}].metadata`)
        const newScope = metadata.scope
        // If the new scope is global or the same as the old scope, do nothing
        if (newScope === 'regional' || oldScope !== newScope) {
          // If layer is toggled on and has a bbox, zoom to that layer
          const bbox = metadata.bbox
          if (bbox) {
            this.$refs.map.map.fitBounds(bbox)
          }
        }
        this.setGeographicalScope(newScope)
      },
      getFeatureInfo(bbox) {
        if (!this.getActiveRasterLayer) {
          this.removeInfoText()
          return
        }

        const parameters = {
          imageId: this.activeRasterData.imageId,
          bbox,
        }

        const band = _.get(this.activeRasterData, 'band')
        const func = _.get(this.activeRasterData, 'function')

        if (band) {
          parameters.band = band
        } else if (func) {
          parameters.function = func
        } else {
          return
        }

        fetch(this.activeRasterData.featureInfoUrl, {
          method: 'POST',
          body: JSON.stringify(parameters),
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(resp => {
            if (resp.value) {
              const units = _.get(this.getDatasets, `${this.getActiveRasterLayer}.metadata.units`)
              this.mapboxMessage = `${resp.value} [${units}]`
              this.infoTextGeometry = bbox
            } else {
              this.removeInfoText()
            }
          })
          .catch(() => {
            this.removeInfoText()
          })
      },
      selectLocations(detail) {
        // On the selection (by mouse event on map) of a location update the
        // route accordingly
        this.geometry = detail.geometry
        const { datasetIds } = this.$route.params
        const locationIds = []
        detail.features.forEach(feature => {
          // When a layer has a metadata with locationIdField use this layer and
          // get the locationId usin this field
          const locId = _.get(feature, 'layer.metadata.locationIdField')
          if (locId) {
            locationIds.push(feature.properties[locId])
          }
        })
        this.updateRoute({
          name: 'datasetIds-locationId',
          params: { datasetIds, locationId: head(locationIds) },
        })
      },
      toggleRasterLayer(event) {
        this.setActiveRasterLayer(event)
        this.removeInfoText()
        this.zoomToBbox(this.getActiveRasterLayer)
      },
      toggleLocationDataset(id) {
        let oldParams = _.get(this.$route, 'params.datasetIds')
        const newRouteObject = this.$route
        let newParams

        // TODO: there are too many if/else scenarios, this should be solved by
        // moving the zoomtobbox logic towards the global/regional themes in
        // the left panel, instead on these datasets.

        if (!oldParams) {
          // If oldParams is undefined, set newParams by id
          newParams = id
        } else {
          // Else check if new id should be removed or added to new route
          oldParams = oldParams.split(',')
          if (oldParams.includes(id)) {
            // if oldparams already includes id, remove from route
            newParams = oldParams.filter(param => param !== id)
            newParams = newParams.join(',')

            if (newParams.length === 0) {
              // If there are no datasets anymore, set the scop back to 'global'
              this.setGeographicalScope('global')
              newParams = undefined
            }
          } else {
            // else add id to route and zoomtobbox
            newParams = `${oldParams},${id}`
            this.zoomToBbox(id)
          }
        }
        newRouteObject.params.datasetIds = newParams
        this.updateRoute(newRouteObject)
      },
      updateRoute(routeObj) {
        // Update route with route object
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
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
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
    width: 22rem;
    max-height: calc(100vh - var(--spacing-large) - var(--map-controls-height));
  }

  .default-layout__timestamp {
    position: absolute;
    top: calc(var(--spacing-default));
    left: calc(var(--nav-bar-width) + var(--spacing-default));
    max-width: 20rem;
    margin-right: calc(var(--spacing-default));
  }

  .default-layout--sidebar-animating .default-layout__timestamp {
    transition: left 0.35s ease;
  }

  .default-layout--sidebar-expanded .default-layout__timestamp {
    left: calc(var(--nav-bar-expanded-width) + var(--spacing-default));
  }

  .default-layout .mapboxgl-ctrl-bottom-left {
    z-index: 0;
    right: 55px;
    bottom: var(--spacing-default);
    left: auto;
  }
</style>
