<template>
  <v-card
    dark
    raised
    max-height="80vh"
    class="pa-0 data-set-controls"
    data-v-step="3"
  >
    <v-card-title class="h3">
      {{ themeName }}
    </v-card-title>
    <v-card-text class="scrollbar data-set-controls__text px-0 pb-0">
      <v-expansion-panels
        accordion
        flat
        tile
        :value="activePanels"
        multiple
        readonly
        color="background"
      >
        <v-radio-group
          v-model="activeRasterLayer"
          class="data-set-controls__group ma-0"
        >
          <v-expansion-panel
            v-for="(dataset, index) in datasets"
            :key="dataset.id"
            :data-v-step="index === 1 ? '4' : false"
          >
            <v-expansion-panel-header hide-actions color="background" dark>
              <v-row>
                <v-col cols="1" class="ma-auto pa-0">
                  <custom-icon :name="dataset.id" iconFolder="datasets" />
                </v-col>
                <v-col cols="7" class="ma-auto pa-0">
                  <span class="ml-2 d-sm-none d-md-flex">{{
                    dataset.title
                  }}</span>
                </v-col>
                <v-col cols="2" class="ma-auto pa-0">
                  <v-switch
                    class="my-auto switch"
                    v-if="checkLayerType(dataset.id, 'mapbox')"
                    dense
                    flat
                    v-model="dataset.visible"
                    color="formActive"
                    @change="toggleLocationDataset(dataset)"
                  ></v-switch>
                </v-col>
                <v-col cols="1" class="ma-auto pa-0">
                  <v-radio
                    dense
                    class="ma-auto radio"
                    v-show="
                      checkLayerType(dataset.id, 'gee') &&
                        !datasetLoading(dataset.id)
                    "
                    :value="dataset.id"
                    @click="setRasterLayer(dataset.id)"
                    color="formActive"
                  ></v-radio>
                  <v-progress-circular
                    dense
                    class="ma-auto"
                    v-show="
                      checkLayerType(dataset.id, 'gee') &&
                        datasetLoading(dataset.id)
                    "
                    indeterminate
                    color="formActive"
                  ></v-progress-circular>
                </v-col>
                <v-col cols="1" class="ma-auto pa-0">
                  <v-btn
                    icon
                    class="my-auto"
                    @click="onTooltipClick(dataset.id)"
                  >
                    <custom-icon v-if="dataset.description" name="info" />
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pa-0" color="background">
              <div v-if="getActiveVectorDataIds === dataset.id">
                <static-legend
                  :dataset-id="dataset.id"
                  class="data-set-controls__legend-bar"
                />
              </div>
              <div v-if="getActiveVectorDataIds === dataset.id">
                <br />
                <v-row>
                  <v-col
                    cols="6"
                    class="ma-auto pa-0"
                    v-for="summary in dataset.summaries"
                    :key="summary.id"
                  >
                    <v-select
                      class="pa-2"
                      v-model="summary.chosenValue"
                      :items="summary.allowedValues"
                      :label="summary.id"
                      flat
                      dense
                      @change="toggleLocationDatasetSummary(dataset)"
                    />
                  </v-col>
                </v-row>
              </div>
              <div
                v-if="dataset.description && hoverId === dataset.id"
                class="data-set-controls__tooltip"
              >
                <div
                  v-html="markedTooltip(dataset.description)"
                  class="data-set-controls__tooltip-text markdown pa-2"
                  :anchor-attributes="{ target: '_blank' }"
                  :watches="['source']"
                />
              </div>
              <v-select
                class="pa-2"
                v-if="getActiveRasterLayer === dataset.id && hasBands"
                v-model="selectedLayer"
                :value="selectedLayer"
                :items="activeRasterData.summaries['eo:bands']"
                :label="`Select layer`"
                flat
                item-text="description"
                item-value="name"
                dense
                @change="updateRasterBand"
              />
              <div v-if="activeRasterLayer === dataset.id">
                <br />
                <layer-legend
                  :dataset-id="dataset.id"
                  class="data-set-controls__legend-bar"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-radio-group>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import CustomIcon from '@/components/CustomIcon'
import LayerLegend from '@/components/LayerLegend'
import StaticLegend from '@/components/StaticLegend'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import marked from 'marked'
import _ from 'lodash'

const renderer = new marked.Renderer()
renderer.link = function(href, title, text) {
  return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
}

export default {
  props: {
    datasets: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    CustomIcon,
    LayerLegend,
    StaticLegend
  },
  computed: {
    ...mapGetters([
      'getActiveRasterLayer',
      'getActiveTheme',
      'getDatasets',
      'activeRasterData',
      'loadingRasterLayers',
      'activeVectorData',
      'getActiveVectorDataIds'
    ]),
    themeName() {
      return this.getActiveTheme || 'Map layers'
    },
    activePanels() {
      const active = _.values(this.datasets).flatMap((dataset, index) => {
        const activeDataset =
          this.hoverId === dataset.id ||
          this.activeRasterLayer === dataset.id ||
          (this.getActiveVectorDataIds === dataset.id &&
            _.get(
              this.activeVectorData,
              `${dataset.id}.properties.deltares:legendFile`
            ) === 'legenda')
        return activeDataset ? index : []
      })

      // Take care that setActiveVectorDataIds is set when entering site with vector layer enabled
      const params = this.$route.params
      const initialDataset = _.get(this.datasets, `${params.datasetIds}`)

      if (this.getActiveVectorDataIds === '' && params.datasetIds !== '') {
        if (
          typeof initialDataset !== 'undefined' &&
          typeof initialDataset.summaries !== 'undefined'
        ) {
          this.toggleLocationDataset(initialDataset)
        }
      }

      return active
    },
    hasBands() {
      return _.has(this.activeRasterData, 'summaries.eo:bands')
    },
    selectedLayer: {
      get() {
        return _.get(this.activeRasterData, 'properties.deltares:band', null)
      },
      set(val) {
        this.setRasterProperty({ prop: 'deltares:band', data: val })
      }
    }
  },
  data() {
    return {
      hoverId: '',
      activeRasterLayer: ''
    }
  },
  mounted() {
    this.activeRasterLayer = this.getActiveRasterLayer
  },
  methods: {
    ...mapMutations([
      'setActiveRasterLayerId',
      'setRasterData',
      'setRasterProperty',
      'setLoadingRasterLayers',
      'setActiveVectorDataIds',
      'setActiveSummary'
    ]),
    ...mapActions([
      'loadActiveRasterData',
      'loadActiveRasterLayer',
      'loadPointDataForLocation'
    ]),
    markedTooltip(text) {
      return marked(text, { renderer: renderer })
    },
    datasetLoading(datasetId) {
      if (this.activeRasterLayer === datasetId) {
        return this.loadingRasterLayers
      } else {
        return false
      }
    },
    onTooltipClick(id) {
      this.hoverId ? (this.hoverId = null) : (this.hoverId = id)
    },
    toggleLocationDataset(dataset) {
      let oldParams = _.get(this.$route, 'params.datasetIds')
      const params = this.$route.params
      let newParams
      if (!oldParams) {
        // If oldParams is undefined, set newParams by id
        newParams = dataset.id
      } else if (oldParams && this.getActiveVectorDataIds === '') {
        // When entering site with vector layer enabled, leave param in route as is
        newParams = oldParams
      } else if (oldParams && typeof dataset.id !== 'undefined') {
        // Else check if new id should be removed or added to new route
        oldParams = oldParams.split(',')
        if (oldParams.includes(dataset.id)) {
          // if oldparams already includes id, remove from route
          // this way, it is removed from the route is switch is disabled
          newParams = oldParams.filter(param => param !== dataset.id)
          // newParams = oldParams
          if (newParams.length === 0) {
            newParams = undefined
          } else {
            newParams = newParams.join(',')
          }
        } else {
          // else add id to route and zoomtobbox
          newParams = `${oldParams},${dataset.id}`
        }
      }
      params.datasetIds = newParams
      let path = `/data/${params.datasetIds}`
      if (_.has(params, 'locationId')) {
        path = `/data/${params.datasetIds}/${params.locationId}`
      }
      if (newParams && newParams !== oldParams) {
        this.$router.push({ path, params })
      } else if (newParams === undefined) {
        this.$router.push('/data')
      }

      // Store which vector layers are active
      this.setActiveVectorDataIds(params.datasetIds)

      // create new activeSummary list (only if summary exists for dataset)
      if (dataset.summaries !== undefined) {
        this.setActiveSummary(dataset.summaries)
      }
    },
    toggleLocationDatasetSummary(dataset) {
      // Store which summary is active
      this.setActiveSummary(dataset.summaries)
    },
    checkLayerType(id, type) {
      // Check if type is in one of the titles of the children
      const layers = _.get(this.datasets, `${id}.links`)
      if (!layers) {
        return false
      }
      const typeArray = layers.map(layer => {
        const title = _.get(layer, 'title')
        if (!title) {
          return false
        }
        const regex = `${id}-(.+)`
        const layerType = title.match(regex)[1]
        return layerType === type
      })
      return typeArray.includes(true)
    },
    updateRasterBand() {
      this.loadActiveRasterLayer()
      this.activeRasterLayer = this.getActiveRasterLayer
    },
    setRasterLayer(id) {
      if (this.getActiveRasterLayer === id) {
        id = null
      }
      this.setRasterData({})
      this.setLoadingRasterLayers(true)
      this.setActiveRasterLayerId(id)
      this.loadActiveRasterData(id)
      this.activeRasterLayer = this.getActiveRasterLayer
    }
  }
}
</script>

<style scoped>
.data-set-controls {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: var(--spacing-default);
  right: var(--spacing-default);
  z-index: 5;
  width: 30vw;
  max-width: 400px;
  min-width: 250px;
}

.data-set-controls__text {
  height: 90%;
}

.data-set-controls__group {
  height: 100%;
  width: 100%;
}

.data-set-controls__tooltip,
.data-set-controls__tooltip {
  position: relative;
  width: 100%;
  height: 100%;
}

.data-set-controls__tooltip-text::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 4px;
  width: 0;
  height: 0;
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--v-quietHover-base);
  border-left: 8px solid transparent;
}

.data-set-controls__tooltip-text {
  position: relative;
  border-radius: 5px;
  background-color: var(--v-quietHover-base);
  box-shadow: 4px 6px 20px -4px rgba(0, 0, 0, 0.5);
  color: var(--v-textColor-base);
}

.switch {
  top: 8px;
  position: relative;
}

.v-expansion-panel {
  border-color: var(--v-background-base);
}

.v-input--selection-controls__input .v-icon {
  color: var(--v-primary-darken2);
}
</style>
