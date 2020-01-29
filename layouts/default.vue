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
        />
        <v-mapbox-selected-point-layer
          :geometry="geometry"
        />
        <v-mapbox-info-text-layer
          :geometry="infoTextGeometry"
          :message="mapboxMessage"
        />
        <v-mapbox-vector-layer
          v-for="vectorLayer in vectorLayers"
          :key="vectorLayer.id"
          :name="vectorLayer.id"
          :layer="vectorLayer"
          :active-theme="activeTheme"
          @select-locations="selectLocations"
        />
        <v-mapbox-raster-layer :options="rasterLayer" @click="getFeatureInfo" />
      </v-mapbox>
    </no-ssr>
    <DataSetControlMenu
      class="default-layout__data-set-control-menu"
      :datasets="datasetsInActiveTheme"
      @toggle-location-dataset="toggleLocationDataset"
      @toggle-raster-layer="toggleRasterLayer"
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import DataSetControlMenu from '../components/data-set-control-menu'
import SiteNavigation from '../components/site-navigation'
import TimeStamp from '../components/time-stamp'
import { when } from '../lib/utils'
import getVectorLayer from '../lib/mapbox/layers/get-vector-layer'
import getRasterLayer from '../lib/mapbox/layers/get-raster-layer'
import VMapboxVectorLayer from '../components/v-mapbox-components/v-mapbox-vector-layer'
import VMapboxRasterLayer from '../components/v-mapbox-components/v-mapbox-raster-layer'
import VMapboxSelectedPointLayer from '../components/v-mapbox-components/v-mapbox-selected-point-layer'
import VMapboxInfoTextLayer from '../components/v-mapbox-components/v-mapbox-info-text-layer'

const bands = {
  cc: 'magnitude',
  dd: 'discharge_routed_simulated',
  gb: 'elevation',
  mt: 'mean_temperature',
  pp: 'daily_precipitation',
  tt: 'astronomical_tide',
  wd: 'magnitude',
  wl: 'water_level',
  sh: 'water_level_surge',
  wv: 'waveheight'
}
export default {
  components: {
    SiteNavigation,
    DataSetControlMenu,
    TimeStamp,
    VMapboxVectorLayer,
    VMapboxRasterLayer,
    VMapboxSelectedPointLayer,
    VMapboxInfoTextLayer
  },
  data: () => ({
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
    locationsLayers: [],
    activeLocation: null,
    geometry: {
      type: 'Point',
      coordinates: []
    },
    infoTextGeometry: {
      type: 'Point',
      coordinates: []
    },
    mapboxMessage: ''
  }),
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active,
      activeLocationIds: state => state.map.activeLocationIds
    }),
    ...mapGetters('map', [
      'activeRasterData',
      'activeVectorData',
      'activeDatasetsLocations',
      'datasetsInActiveTheme',
      'activeTimestamp',
      'activeDatasets',
      'getActiveTheme',
      'getActiveRasterLayer',
      'getDatasets'
    ]),
    rasterLayer () {
      const rasterLayer = getRasterLayer()
      rasterLayer.source.tiles = _.get(this.activeRasterData, 'tiles')
      return rasterLayer
    },
    vectorLayers () {
      // Returns an array with unique mapboxlayers.
      // Get active vectorlayers and flatten, all mapboxlayers into 1 array
      const vectorLayers = _.flatten(this.activeVectorData)
      // Get Default vector mapboxlayer
      const defaultVectorLayer = getVectorLayer()
      // get all unique layerIds
      const layerIds = vectorLayers.map(layer => layer.id)
      const uniqueLayerIds = _.uniq(layerIds)
      // for each layer id merge the mapboxlayers that have that id
      const newLayers = uniqueLayerIds.map((id) => {
        const groupedLayers = vectorLayers.filter(layer => layer.id === id)
        const flattenedLayers = _.flatten(groupedLayers)
        const layer = _(flattenedLayers)
          .groupBy('id')
          .map(g =>
            _.mergeWith({}, ...g, (obj, src) =>
              _.isArray(obj) ? obj.concat(src) : undefined
            )
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
    }
  },
  watch: {
    $route: {
      handler (routeObj) {
        if (routeObj.params.datasetIds === undefined) {
          this.clearActiveDatasetIds()
        }
        if (routeObj.params.locationId === undefined) {
          this.geometry = {
            type: 'Point',
            coordinates: []
          }
        }
      },
      deep: true
    }
  },
  async mounted () {
    await this.$nextTick()
  },
  methods: {
    ...mapMutations('map', ['clearActiveDatasetIds', 'setActiveRasterLayer']),
    removeInfoText () {
      this.infoTextGeometry = {
        type: 'Point',
        coordinates: []
      }
    },
    updateFilter (layer) {
      // if there is a filterIds, concatenate the values into filter
      if (_.get(layer, 'filterIds')) {
        const filter = ['any']
        layer.filterIds.forEach((id) => {
          filter.push(['==', ['get', id], true])
        })
        layer.filter = filter
      }
      return layer
    },
    getFeatureInfo (bbox) {
      if (!this.getActiveRasterLayer) {
        this.removeInfoText()
        return
      }
      const parameters = {
        imageId: this.activeRasterData.imageId,
        bbox,
        band: bands[this.getActiveRasterLayer]
      }
      fetch(this.activeRasterData.featureInfoUrl, {
        method: 'POST',
        body: JSON.stringify(parameters),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then((resp) => {
          if (resp.value) {
            const units = _.get(
              this.getDatasets,
              `${this.getActiveRasterLayer}.metadata.units`
            )
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
    selectLocations (detail) {
      // On the selection (by mouse event on map) of a location update the
      // route accordingly
      this.geometry = detail.geometry
      const { datasetIds } = this.$route.params
      const locationIds = []
      detail.features.forEach((feature) => {
        // When a layer has a metadata with locationIdField use this layer and
        // get the locationId usin this field
        const locId = _.get(feature, 'layer.metadata.locationIdField')
        if (locId) {
          locationIds.push(feature.properties[locId])
        }
      })
      this.updateRoute({
        name: 'datasetIds-locationId',
        params: { datasetIds, locationId: head(locationIds) }
      })
    },
    toggleRasterLayer (event) {
      this.setActiveRasterLayer(event)
      this.removeInfoText()
    },
    toggleLocationDataset (id) {
      const addId = value => concat(value, id)
      const removeId = filter(negate(isEqual(id)))
      const toggleIdDatasets = pipe([
        split(','),
        when(includes(id), removeId, addId),
        filter(identity),
        join(','),
        when(isEqual(''), () => undefined, identity)
      ])

      const newRouteObject = update(
        'params.datasetIds',
        toggleIdDatasets,
        this.$route
      )
      this.updateRoute(newRouteObject)
    },
    changeTheme () {
      // When new theme is chosen update the route with the datasets within
      // this theme
      const newRouteObject = this.$route

      const oldIds = newRouteObject.params.datasetIds
      const datasets = this.getActiveTheme.datasets

      let newparams
      let oldIdsArray = []
      if (oldIds) {
        oldIdsArray = oldIds.split(',')
      }

      const newIds = _.intersection(oldIdsArray, datasets)

      if (newIds.length > 0) {
        newparams = newIds.join(',')
      }
      newRouteObject.params.datasetIds = newparams
      this.updateRoute(newRouteObject)
    },
    updateRoute (routeObj) {
      // Update route with route object
      const { datasetIds, locationId } = routeObj.params
      if (datasetIds === undefined) {
        this.geometry = {
          type: 'Point',
          coordinates: []
        }
      }
      if (datasetIds === undefined && locationId !== undefined) {
        routeObj = update('params.locationId', () => undefined, routeObj)
      }

      this.$router.push(routeObj)
    }
  }
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
  width: 20rem;
  max-height: calc(100vh - var(--spacing-large) - var(--map-controls-height));
  margin-left: calc(var(--spacing-default) * 3);
}

.default-layout__site-navigation {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
}

.default-layout__timestamp {
  position: absolute;
  left: calc(var(--spacing-default) * 3);
  top: calc(var(--spacing-default));
  margin-right: calc(var(--spacing-default));
  max-width: 20rem;
}

.default-layout .mapboxgl-ctrl-bottom-left {
  left: var(--site-nav-width-collapsed);
  z-index: 0;
}
</style>
