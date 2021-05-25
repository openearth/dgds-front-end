<template>
  <v-card dark raised max-height="80vh" class="pa-0 data-set-controls" data-v-step="3">
    <v-card-title class="h3">
      {{ themeName }}
    </v-card-title>
    <v-card-text class='scrollbar data-set-controls__text px-0 pb-0'>
      <v-expansion-panels
        accordion
        flat
        :value="activePanels"
        multiple
        readonly
        color="background">
        <v-radio-group v-model="activeRasterLayer" class='data-set-controls__group ma-0'>
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
                  <span class="ml-2 d-sm-none d-md-flex">{{ dataset.title }}</span>
                </v-col>
                <v-col cols="2" class="ma-auto pa-0">
                  <v-switch
                    class="my-auto switch"
                    v-if="checkLayerType(dataset.id, 'mapbox')"
                    dense
                    flat
                    v-model="dataset.visible"
                    color="formActive"
                    @change="toggleLocationDataset(dataset.id)"
                  ></v-switch>
                </v-col>
                <v-col cols="1" class="ma-auto pa-0">
                  <v-radio
                    dense
                    v-if="checkLayerType(dataset.id, 'gee')"
                    :value="dataset.id"
                    @click="setRasterLayer(dataset.id)"
                    color="formActive"
                  ></v-radio>
                </v-col>
                <v-col cols="1" class="ma-auto pa-0">
                  <v-btn icon class="my-auto" @click="onTooltipClick(dataset.id)" >
                    <custom-icon v-if="dataset.description" name="info" />
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pa-0" color="background">
              <div v-if="dataset.description && hoverId === dataset.id" class="data-set-controls__tooltip">
                <div
                  v-html="markedTooltip(dataset.description)"
                  class="data-set-controls__tooltip-text markdown pa-2"
                  :anchor-attributes="{ target: '_blank' }"
                  :watches="['source']"
                  />
                </div>
                <v-select
                  class="pa-2"
                  v-if="getActiveRasterLayer === dataset.id && dataset.layerOptions"
                  v-model="selectedLayer"
                  :value="selectedLayer"
                  :items="dataset.layerOptions"
                  :label="`Select layer`"
                  return-object
                  flat
                  item-text="name"
                  item-value="band"
                  dense
                />
              <div v-if="activeRasterLayer === dataset.id">
                <layer-legend :dataset-id="dataset.id" class="data-set-controls__legend-bar" />
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
import { mapGetters, mapActions, mapMutations } from 'vuex'
import marked from 'marked'
import _ from 'lodash'

export default {
  props: {
    datasets: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    CustomIcon,
    LayerLegend
  },
  computed: {
    ...mapGetters([
      'getActiveRasterLayer',
      'getActiveTheme',
      'getDatasets',
      'activeRasterData'
    ]),
    themeName () {
      return _.get(this.getActiveTheme, 'name') || 'All datasets'
    },
    activePanels () {
      // map which panel is showing the legend layer or the information layer)
      const active = _.values(this.datasets).flatMap((dataset, index) => {
        const activeDataset = this.hoverId === dataset.id || this.activeRasterLayer === dataset.id
        return activeDataset ? index : []
      })
      console.log('setting active paels', this.activeRasterLayer, active)
      return active
    }
  },
  data () {
    return {
      hoverId: '',
      activeRasterLayer: '',
      selectedLayer: ''
    }
  },
  mounted () {
    this.activeRasterLayer = this.getActiveRasterLayer
  },
  methods: {
    ...mapMutations(['setActiveRasterLayerId', 'setRasterData']),
    ...mapActions(['loadActiveRasterData']),
    markedTooltip (text) {
      return marked(text)
    },
    onTooltipClick (id) {
      this.hoverId ? (this.hoverId = null) : (this.hoverId = id)
    },
    toggleLocationDataset (id) {
      let oldParams = _.get(this.$route, 'params.datasetIds')
      const params = this.$route.params
      let newParams

      if (!oldParams) {
        // If oldParams is undefined, set newParams by id
        newParams = id
      } else {
        // Else check if new id should be removed or added to new route
        oldParams = oldParams.split(',')
        if (oldParams.includes(id)) {
          // if oldparams already includes id, remove from route
          newParams = oldParams.filter(param => param !== id)
          if (newParams.length === 0) {
            newParams = undefined
          } else {
            newParams = newParams.join(',')
          }
        } else {
          // else add id to route and zoomtobbox
          newParams = `${oldParams},${id}`
        }
      }
      params.datasetIds = newParams
      let path = `/${params.datasetIds}`
      if (_.has(params, 'locationId')) {
        path = `${path}/${params.locationId}`
      }
      if (newParams) {
        this.$router.push({ path, params })
      } else {
        this.$router.push('/')
      }
    },
    checkLayerType (id, type) {
      // Check if type is in one of the titles of the children
      const layers = _.get(this.datasets, `${id}.links`)
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
    setRasterLayer (id) {
      if (this.getActiveRasterLayer === id) {
        id = null
      }
      this.setRasterData({})
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

.data-set-controls__tooltip, .data-set-controls__tooltip {
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
</style>
