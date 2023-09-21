<template>
  <v-mapbox
    id="map"
    ref="map"
    :access-token="mapboxAccessToken"
    :preserve-drawing-buffer="true"
    map-style="mapbox://styles/global-data-viewer/cjtss3jfb05w71fmra13u4qqm"
    :logoPosition="'bottom-right'"
    :trackResize="'false'"
    @mb-load="mapLoaded = true"
  >
    <v-mapbox-navigation-control
      :options="{ visualizePitch: true }"
      position="bottom-right"
      data-v-step="5"
    />
    <v-mapbox-selected-point-layer v-if="mapLoaded" :geometry="geometry" />
    <v-mapbox-info-text-layer
      v-if="mapLoaded"
      :geometry="infoTextGeometry"
      :message="mapboxMessage"
    />
    <template v-if="mapLoaded">
      <v-mapbox-vector-layer
        v-for="vectorLayer in vectorLayers"
        :key="vectorLayer.id"
        :name="vectorLayer.id"
        :layer="vectorLayer"
        @select-locations="selectLocations"
      />
    </template>
    <v-mapbox-raster-layer
      v-if="mapLoaded"
      :options="rasterLayer"
      @click="getFeatureInfo"
    />
    <v-mapbox-flowmap-layer
      v-if="mapLoaded && showFlowmapLayer"
      :options="flowmapLayer"
    />
  </v-mapbox>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import _ from 'lodash'

import getVectorLayer from '@/lib/mapbox/layers/get-vector-layer'
import getRasterLayer from '@/lib/mapbox/layers/get-raster-layer'
import VMapboxVectorLayer from '@/components/v-mapbox-components/v-mapbox-vector-layer'
import VMapboxRasterLayer from '@/components/v-mapbox-components/v-mapbox-raster-layer'
import VMapboxFlowmapLayer from '@/components/v-mapbox-components/v-mapbox-flowmap-layer'
import VMapboxSelectedPointLayer from '@/components/v-mapbox-components/v-mapbox-selected-point-layer'
import VMapboxInfoTextLayer from '@/components/v-mapbox-components/v-mapbox-info-text-layer'

export default {
  mounted() {
    this.map = this.$refs.map.map
    this.zoomToLastDatasetId()
  },
  components: {
    VMapboxVectorLayer,
    VMapboxRasterLayer,
    VMapboxFlowmapLayer,
    VMapboxSelectedPointLayer,
    VMapboxInfoTextLayer
  },
  watch: {
    '$route.params.datasetIds'(val) {
      if (!val) {
        this.clearActiveDatasetIds()
        this.setGeographicalScope('global')
      } else {
        this.zoomToLastDatasetId()
      }
    },
    '$route.params.locationId'(val) {
      if (!val) {
        this.geometry = {
          type: 'Point',
          coordinates: []
        }
      } else {
        // TODO: Here comes the piece of magic to update
        // the map whenever you come in via different route
      }
    },
    rasterLayer(val) {
      this.removeInfoText()
    }
  },
  data() {
    return {
      mapboxAccessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      locationsLayers: [],
      activeLocation: null,
      mapLoaded: false,
      geometry: {
        type: 'Point',
        coordinates: []
      },
      infoTextGeometry: {
        type: 'Point',
        coordinates: []
      },
      mapboxMessage: ''
    }
  },
  computed: {
    ...mapState(['activeLocationIds', 'loadingRasterLayers']),
    ...mapGetters([
      'activeDatasetIds',
      'activeRasterData',
      'activeFlowmapData',
      'activeVectorData',
      'activeVectorLayers',
      'activeTimestamp',
      'activeSummary',
      'getActiveRasterLayer',
      'getDatasets',
      'getGeographicalScope',
      'knownVectorData'
    ]),
    rasterLayer() {
      const rasterLayer = getRasterLayer()
      rasterLayer.source.tiles = [
        _.get(this.activeRasterData, 'layer.assets.visual.href')
      ]
      return rasterLayer
    },
    flowmapLayer() {
      const flowmapLayer = getRasterLayer()
      flowmapLayer.source.tiles = [
        _.get(this.activeFlowmapData, 'assets.flowmap.href')
      ]
      return flowmapLayer
    },
    showFlowmapLayer() {
      return !_.isEmpty(this.activeFlowmapData)
    },
    vectorLayers() {
      // Returns an array with unique mapboxlayers.
      // Get active vectorlayers and flatten, all mapboxlayers into 1 array
      const activeVectorLayers = this.getMapboxLayers(this.activeVectorData)

      const vectorLayers = _.flatten(activeVectorLayers)
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
  methods: {
    ...mapMutations([
      'clearActiveDatasetIds',
      'setActiveRasterLayerId',
      'setGeographicalScope',
      'setActiveLocationIndex'
    ]),

    getMapboxLayers(collection) {
      const vectorDatasets = this.activeDatasetIds.map(datasetId => {
        return _.get(collection, datasetId)
      })
      const mapboxLayers = []
      vectorDatasets.forEach(dataset => {
        if (!_.has(dataset, 'layers')) {
          return
        }
        dataset.layers.forEach(layer => {
          if (_.has(dataset, 'summaries')) {
            // If extra selection is needed and described in the summaries.
            const layerSelected = this.activeSummary.every(summary => {
              if (layer.id.includes(summary.id)) {
                const substring = layer.id.split(`${summary.id}-`)[1]
                return substring.indexOf(summary.chosenValue) === 0
              } else {
                return true
              }
            })
            if (!layerSelected) {
              return
            }
          }
          const mapboxLayer = {}
          Object.entries(layer.properties).forEach(([id, prop]) => {
            const regex = 'deltares:(.+)'
            const propId = id.match(regex)
            if (_.get(propId, '1')) {
              mapboxLayer[propId[1]] = prop
            }
          })
          mapboxLayer.metadata = dataset.properties
          mapboxLayers.push(mapboxLayer)
        })
      })
      return mapboxLayers
    },

    zoomToLastDatasetId() {
      const params = _.get(this.$route, 'params.datasetIds')
      if (!params) {
        return
      }
      const ids = params.split(',')
      this.zoomToBbox(ids[ids.length - 1])
    },
    removeInfoText() {
      this.infoTextGeometry = {
        type: 'Point',
        coordinates: []
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
      setTimeout(() => {
        const oldScope = this.getGeographicalScope
        const newScope = _.get(
          this.getDatasets,
          `${datasetId}.properties.deltares:scope`
        )
        // If the new scope is global or the same as the old scope, do nothing
        if (newScope === 'regional' && oldScope !== newScope) {
          // If layer is toggled on and has a bbox, zoom to that layer
          const coords = _.get(
            this.getDatasets,
            `${datasetId}.extent.spatial.bbox[0]`
          )
          const bbox = [
            [coords[0], coords[1]],
            [coords[2], coords[3]]
          ]
          if (bbox) {
            this.$refs.map.map.fitBounds(bbox)
          }
        }
        this.setGeographicalScope(newScope)
      }, 1000)
    },
    getFeatureInfo(bbox) {
      if (!this.activeRasterData) {
        this.removeInfoText()
        return
      }

      const parameters = {
        imageId: _.get(
          this.activeRasterData,
          'layer.properties.deltares:imageId'
        ),
        bbox
      }

      const band = _.get(
        this.activeRasterData,
        'layer.properties.deltares:band'
      )
      const func = _.get(
        this.activeRasterData,
        'layer.properties.deltares:function'
      )

      if (band) {
        parameters.band = band
      } else if (func) {
        parameters.function = func
      } else {
        return
      }

      fetch(_.get(this.activeRasterData, 'assets.featureinfo.href'), {
        method: 'POST',
        body: JSON.stringify(parameters),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(resp => {
          if (resp.value) {
            const dataset = this.getDatasets[this.getActiveRasterLayer]
            const units = _.get(dataset, 'properties.deltares:units')
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
      const locationIds = []
      // detail.feature.properties contains attributes from Mapbox points
      detail.features.forEach(feature => {
        // When a layer has a metadata with locationIdField use this layer and
        // get the locationId usin this field
        const locId = _.get(feature, 'layer.metadata.deltares:locationIdField')
        if (locId) {
          locationIds.push(feature.properties[locId])
        }
        // write location index for zarr file to state
        if (feature.properties.zarrIndex) {
          this.setActiveLocationIndex(feature.properties.zarrIndex)
        }
      })
      const params = this.$route.params
      params.locationId = _.head(locationIds)

      // Check if route is different, and only change if this is the case (to avoid route errors with SLR data)
      if (
        this.$router.currentRoute.path !==
        `/data/${params.datasetIds}/${params.locationId}`
      ) {
        this.$router.push({
          path: `/data/${params.datasetIds}/${params.locationId}`,
          params
        })
      }

      // this.$router.push({ path: `/data/${params.datasetIds}/${params.locationId}`, params })
    },
    toggleRasterLayer(event) {
      this.setActiveRasterLayerId(event)
      this.loadActiveRasterItem()
      this.removeInfoText()
      this.zoomToBbox(this.getActiveRasterLayer)
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}

#map .mapboxgl-ctrl-bottom-left {
  z-index: 0;
  right: 55px;
  bottom: 1.5rem;
  left: auto;
}

#map .mapboxgl-ctrl-bottom-right {
  padding-right: 12px;
}
</style>
