<template>
  <div class="data-set-controls">
    <v-card dark raised height="100%">
      <v-card-title>
        {{ themeName }}
      </v-card-title>
      <v-card-text class='scrollbar data-set-controls--card'>
        <v-expansion-panels
          accordion
          flat
          :value="activePanels"
          multiple
          readonly
          lazy>
          <v-expansion-panel
            v-for="(dataset) in datasets"
            :key="dataset.id"
          >
            <v-expansion-panel-header hide-actions>
              <v-row>
                <custom-icon class="mr-1 my-auto" :name="dataset.id" iconFolder="datasets" />
                <span class="my-auto">{{ dataset.name }}</span>
                <v-spacer />
                <v-switch
                  class="my-auto"
                  v-if="checkVector(dataset.id)"
                  dense
                  flat
                  v-model="dataset.visible"
                  @change="toggleLocationDataset(dataset.id)"
                ></v-switch>
                <v-radio
                  dense
                  class="my-auto"
                  v-if="checkRaster(dataset.id)"
                  :value="dataset.id === getActiveRasterLayer"
                  @click="toggleRasterLayer(dataset.id)"
                ></v-radio>
                <v-btn icon class="my-auto" @click="onTooltipClick(dataset.id)" >
                  <custom-icon v-if="dataset.toolTip" name="info" />
                </v-btn>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-if="dataset.toolTip && hoverId === dataset.id" class="data-set-controls__tooltip">
                <div
                  v-html="dataset.toolTip"
                  :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
                  class="data-set-controls__tooltip-text markdown"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import CustomIcon from '@/components/CustomIcon'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  props: {
    datasets: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CustomIcon
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
    }
  },
  data () {
    return {
      activePanels: [],
      hoverId: ''
    }
  },
  methods: {
    ...mapActions('map', ['retrieveRasterLayerByImageId']),
    onTooltipClick (id) {
      this.hoverId ? (this.hoverId = null) : (this.hoverId = id)
      this.setActivePanels()
    },
    toggleLocationDataset (id) {
      let oldParams = _.get(this.$route, 'params.datasetIds')
      // const newRouteObject = Object.assign({}, this.$route)
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
      if (newParams) {
        this.$router.push({ name: 'datasetIds', params: { datasetIds: newParams } })
      } else {
        this.$router.push('/')
      }
    },
    toggleRasterLayer (id) {
      if (this.getActiveRasterLayer === id) {
        id = null
      }
      this.$emit('toggle-raster-layer', id)
    },
    checkVector (id) {
      return _.has(this.getDatasets, `${id}.vector`)
    },
    checkRaster (id) {
      return _.has(this.getDatasets, `${id}.raster`)
    },
    updateRasterLayer (value) {
      const datasets = this.getDatasets
      const raster = datasets[this.getActiveRasterLayer]
      const option = raster.metadata.layerOptions.find(opt => {
        return opt.band === this.selectedLayer
      })
      this.retrieveRasterLayerByImageId({
        imageId: raster.raster.imageId,
        options: { band: option.band }
      })
    },
    setActivePanels () {
      const active = this.datasets.flatMap((dataset, index) => {
        const activeDataset = this.hoverId === dataset.id || this.getActiveRasterLayer === dataset.id
        return activeDataset ? index : []
      })
      this.activePanels = active
    }
  }
}
</script>

<style scoped>
.data-set-controls {
  position: absolute;
  top: var(--spacing-default);
  right: var(--spacing-default);
  height: 70vh;
  z-index: 5;
  min-width: 500px;
  width: min-content;
}

.data-set-controls--card {
  position: relative;
  height: calc(100% - 64px);
}

.data-set-controls__tooltip-text {
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 5px;
  background-color: var(--color-quiet-hover);
  box-shadow: 4px 6px 20px -4px rgba(0, 0, 0, 0.5);
  color: var(--color-text-color);
}
</style>
