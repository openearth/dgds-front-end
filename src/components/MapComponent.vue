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
    <v-mapbox-navigation-control :options="{ visualizePitch: true }" position="bottom-right" data-v-step="5"/>
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
    <v-mapbox-raster-layer v-if="mapLoaded" :options="rasterLayer" @click="getFeatureInfo" />
    <v-mapbox-flowmap-layer v-if="mapLoaded && showFlowmapLayer" :options="flowmapLayer" />
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
  mounted () {
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
    '$route.params.datasetIds' (val) {
      if (!val) {
        this.clearActiveDatasetIds()
        this.setGeographicalScope('global')
      } else {
        this.zoomToLastDatasetId()
      }
    },
    '$route.params.locationId' (val) {
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
    rasterLayer (val) {
      this.removeInfoText()
    }
  },
  data () {
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
      'activeRasterData',
      'activeFlowmapData',
      'activeVectorData',
      'activeDatasetsLocations',
      'activeTimestamp',
      'activeDatasets',
      'getActiveRasterLayer',
      'getDatasets',
      'getGeographicalScope'
    ]),
    rasterLayer () {
      const rasterLayer = getRasterLayer()
      rasterLayer.source.tiles = [_.get(this.activeRasterData, 'url')]
      return rasterLayer
    },
    flowmapLayer () {
      const flowmapLayer = getRasterLayer()
      const flowmapData = this.activeFlowmapData
      const url = _.get(flowmapData, 'url')
      if (url) {
        // should this be done using Vue.set?
        flowmapLayer.source.tiles = [url]
      }
      return flowmapLayer
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
      const newLayers = uniqueLayerIds.map(id => {
        const groupedLayers = vectorLayers.filter(layer => layer.id === id)
        const flattenedLayers = _.flatten(groupedLayers)
        const layer = _(flattenedLayers)
          .groupBy('id')
          .map(g =>
            _.mergeWith({}, ...g, (obj, src) => (_.isArray(obj) ? obj.concat(src) : undefined))
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
    showFlowmapLayer () {
      const layer = this.getActiveRasterLayer
      return layer === 'cc'
    }
  },
  methods: {
    ...mapMutations([
      'clearActiveDatasetIds',
      'setActiveRasterLayer',
      'setGeographicalScope'
    ]),
    zoomToLastDatasetId () {
      const params = _.get(this.$route, 'params.datasetIds')
      if (!params) {
        return
      }
      const ids = params.split(',')
      this.zoomToBbox(ids[ids.length - 1])
    },
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
        layer.filterIds.forEach(id => {
          filter.push(['==', ['get', id], true])
        })
        layer.filter = filter
      }
      return layer
    },
    zoomToBbox (datasetId) {
      setTimeout(() => {
        const oldScope = this.getGeographicalScope
        const metadata = _.get(this.getDatasets, `[${datasetId}].metadata`)
        const newScope = _.get(metadata, 'scope')
        // If the new scope is global or the same as the old scope, do nothing
        if (newScope === 'regional' && oldScope !== newScope) {
          // If layer is toggled on and has a bbox, zoom to that layer
          const bbox = metadata.bbox
          if (bbox) {
            this.$refs.map.map.fitBounds(bbox)
          }
        }
        this.setGeographicalScope(newScope)
      }, 1000)
    },
    getFeatureInfo (bbox) {
      if (!this.getActiveRasterLayer) {
        this.removeInfoText()
        return
      }

      const parameters = {
        imageId: this.activeRasterData.imageId,
        bbox
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
          'Content-Type': 'application/json'
        }
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
    selectLocations (detail) {
      // On the selection (by mouse event on map) of a location update the
      // route accordingly
      this.geometry = detail.geometry
      const locationIds = []
      detail.features.forEach(feature => {
        // When a layer has a metadata with locationIdField use this layer and
        // get the locationId usin this field
        const locId = _.get(feature, 'layer.metadata.locationIdField')
        if (locId) {
          locationIds.push(feature.properties[locId])
        }
      })
      const params = this.$route.params
      params.locationId = _.head(locationIds)
      this.$router.push({ path: `/${params.datasetIds}/${params.locationId}`, params })
    },
    toggleRasterLayer (event) {
      this.setActiveRasterLayer(event)
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
