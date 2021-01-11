<template>
  <panel class="data-set-controls" data-v-step="3">
    <template v-slot:header>
      <h3 class="h4">{{ themeName }}</h3>
    </template>
    <ul class="data-set-controls__list">
      <li
        v-for="(dataset, index) in datasets"
        :key="dataset.id"
        :data-v-step="index === 1 ? '4' : false"
      >
        <div class="data-set-controls__item">
          <icon :name="`dataset-${dataset.id}`" />
          <span class="data-set-controls__item-title">{{ dataset.name }}</span>
          <ui-toggle
            v-if="checkVector(dataset.id)"
            :checked="dataset.visible"
            @change="toggleLocationDataset(dataset.id)"
          />
          <div class="data-set-controls__item-radio">
            <ui-radio
              v-if="checkRaster(dataset.id)"
              :checked="dataset.id === getActiveRasterLayer"
              @click="toggleRasterLayer(dataset.id)"
            />
          </div>
          <div v-if="dataset.toolTip" class="tooltip" @click="onTooltipClick(dataset.id)">
            <icon name="info" />
          </div>
        </div>
        <div v-if="dataset.toolTip && hoverId === dataset.id" class="data-set-controls__tooltip">
          <vue-markdown
            :source="dataset.toolTip"
            :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
            class="data-set-controls__tooltip-text markdown"
          />
        </div>
        <div
          v-if="getActiveRasterLayer === dataset.id && dataset.layerOptions"
          class="data-set-controls__options"
        >
          <ui-select
            id="layer-options-dropdown"
            v-model="selectedLayer"
            :options="items(dataset.layerOptions)"
            :label="`Select ${dataset.name}`"
            class="data-set-controls__select-layer"
            @change="updateRasterLayer"
          />
        </div>
        <div
          v-if="checkRaster(dataset.id)"
          v-show="getActiveRasterLayer === dataset.id"
          class="data-set-controls__legend"
        >
          <layer-legend :dataset-id="dataset.id" class="data-set-controls__legend-bar" />
          <p>[{{ dataset.units }}]</p>
        </div>
      </li>
    </ul>
  </panel>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import VueMarkdown from 'vue-markdown'
  import _ from 'lodash'
  import Icon from './icon'
  import LayerLegend from './layer-legend.vue'
  import Panel from './panel'
  import UiRadio from './ui-radio'
  import UiToggle from './ui-toggle'
  import UiSelect from './ui-select'

  export default {
    components: { Icon, LayerLegend, Panel, UiRadio, UiToggle, VueMarkdown, UiSelect },
    props: {
      datasets: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        hoverId: null,
        selectedLayer: '',
      }
    },
    watch: {
      activeRasterData: {
        handler(data) {
          if (data.length === 0) {
            return
          }
          const datasets = this.getDatasets
          const meta = datasets[this.getActiveRasterLayer].metadata
          const raster = datasets[this.getActiveRasterLayer].raster
          if (meta.layerOptions) {
            this.selectedLayer = raster.band
          }
        },
        deep: true,
      },
    },

    computed: {
      ...mapGetters('map', [
        'getActiveRasterLayer',
        'getActiveTheme',
        'getDatasets',
        'activeRasterData',
      ]),
      themeName() {
        return _.get(this.getActiveTheme, 'name') || 'All datasets'
      },
    },
    methods: {
      ...mapActions('map', ['retrieveRasterLayerByImageId']),
      onTooltipClick(id) {
        this.hoverId ? (this.hoverId = null) : (this.hoverId = id)
      },
      onMouseLeave() {
        this.hoverId = null
      },
      toggleLocationDataset(id) {
        this.$emit('toggle-location-dataset', id)
      },
      toggleRasterLayer(id) {
        if (this.getActiveRasterLayer === id) {
          id = null
        }
        this.$emit('toggle-raster-layer', id)
      },
      checkVector(id) {
        return _.has(this.getDatasets, `${id}.vector`)
      },
      checkRaster(id) {
        return _.has(this.getDatasets, `${id}.raster`)
      },
      updateRasterLayer(value) {
        const datasets = this.getDatasets
        const raster = datasets[this.getActiveRasterLayer]
        const option = raster.metadata.layerOptions.find(opt => {
          return opt.band === this.selectedLayer
        })
        this.retrieveRasterLayerByImageId({
          imageId: raster.raster.imageId,
          options: { band: option.band },
        })
      },
      items(options) {
        // Add value to the array to use in the ui-select
        return options.map(option => {
          option.value = option.band
          return option
        })
      },
    },
  }
</script>

<style>
  .data-set-controls__list {
    padding: 1rem 0 0;
    list-style: none;
  }

  .data-set-controls__list li + li {
    margin-top: 1.25rem;
  }

  .data-set-controls__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .data-set-controls__item .ui-radio,
  .data-set-controls__item .tooltip {
    display: flex;
    margin-left: 0.5rem;
  }

  .data-set-controls__item .ui-radio__button-wrapper {
    margin: 0;
  }

  .data-set-controls__item .tooltip:hover {
    cursor: pointer;
  }

  .data-set-controls__item .tooltip:hover .icon svg {
    transition: fill 0.25s ease;
    fill: var(--color-blue);
  }

  .data-set-controls__item-title {
    flex: 1 1 auto;
    margin: 0 1rem;
  }

  .data-set-controls__tooltip {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .data-set-controls__tooltip-text {
    position: relative;
    flex: 0 0 100%;
    width: min-content;
    padding: 0.5rem 0.75rem;
    border-radius: 5px;
    background-color: var(--color-quiet-hover);
    box-shadow: 4px 6px 20px -4px rgba(0, 0, 0, 0.5);
    color: var(--color-text-color);
  }

  .data-set-controls__tooltip-text::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 4px;
    width: 0;
    height: 0;
    border-right: 8px solid transparent;
    border-bottom: 8px solid var(--color-quiet-hover);
    border-left: 8px solid transparent;
  }

  .data-set-controls__tooltip-text > * {
    margin: 0;
  }

  .data-set-controls__legend {
    display: flex;
    margin-top: 0.5rem;
  }

  .data-set-controls__legend-bar {
    flex: 1 1 auto;
    margin-right: 0.5rem;
  }

  .data-set-controls__legend p {
    margin-bottom: 0;
  }
  .data-set-controls__item-radio {
    width: 32px;
  }
  .data-set-controls__select-layer {
    margin-top: var(--spacing-small);
  }
</style>
