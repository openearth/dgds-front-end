<template>
  <Panel class="data-set-control-menu">
    <span class="data-set-control-menu__title h4 unselectable">{{
      themeName
    }}</span>
    <ul class="data-set-control-menu__list">
      <li
        v-for="dataset in datasets"
        :key="dataset.id"
        class="data-set-control-menu__list-item"
      >
        <div id="menu-control">
          <label class="data-set-control-menu__label">
            <UiTooltip
              v-if="dataset.toolTip"
              class="data-set-control-menu__icon unselectable"
              :tooltip-text="dataset.toolTip"
            >
            <Icon
              class="data-set-control-menu__icon"
              :name="`dataset-${dataset.id}`"
              fallback-name="placeholder"
            />
          </UiToolTip>
          <Icon
            class="data-set-control-menu__icon"
            :name="`dataset-${dataset.id}`"
            fallback-name="placeholder"
            v-else
          />
          <div class="data-set-control-menu__text">
            {{ dataset.name }}
          </div>
            <div class="data-set-control-menu__control">
              <UiToggle
                v-if="checkVector(dataset.id)"
                :checked="dataset.visible"
                @change="toggleLocationDataset(dataset.id)"
              />
            </div>
          </label>
          <div class="data-set-control-radio">
            <UiRadio
              v-if="checkRaster(dataset.id)"
              :checked="dataset.id === getActiveRasterLayer"
              @click="toggleRasterLayer(dataset.id)"
            />
          </div>
        </div>
        <div
          v-if="getActiveRasterLayer === dataset.id"
          class="default-layout__legend"
        >
          <LayerLegend id="layer-legend" />
          <div id="units">
            {{ ` [${dataset.units}]` }}
          </div>
        </div>
      </li>
    </ul>
  </Panel>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Panel from './panel'
import UiToggle from './ui-toggle'
import UiRadio from './ui-radio'
import UiTooltip from './ui-tooltip'
import Icon from './icon'
import LayerLegend from './layer-legend.vue'

export default {
  components: { Panel, UiToggle, Icon, UiRadio, LayerLegend, UiTooltip },
  props: {
    datasets: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters('map', [
      'getActiveRasterLayer',
      'getActiveTheme',
      'getDatasets',
      'activeRasterData'
    ]),
    themeName () {
      return _.get(this.getActiveTheme, 'name') || 'No theme selected'
    }
  },
  methods: {
    toggleLocationDataset (id) {
      this.$emit('toggle-location-dataset', id)
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
    }
  }
}
</script>

<style>
.data-set-control-menu__title {
  padding-bottom: var(--spacing-small);
  display: flex;
  align-items: center;
}

.data-set-control-menu__list {
  list-style: none;
  padding: 0;
}

.data-set-control-menu__list-item {
  min-height: var(--spacing-large);
  align-items: center;
}

.data-set-control-menu__label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
}

.data-set-control-menu__icon {
  width: var(--spacing-default);
  height: var(--spacing-default);
  margin-right: var(--spacing-small);
}

.data-set-control-menu__text {
  flex: 5;
}

#menu-control {
  display: flex;
}

.data-set-control-radio {
  margin-left: auto;
  flex-shrink: 1;
  width: 35px;
}

.default-layout__legend {
  padding-right: 4px;
  margin-top: var(--spacing-small);
  margin-bottom: var(--spacing-small);
  position: relative;
  display: flex;
  width: 100%;
}

#layer-legend {
  flex-grow: inherit;
  margin-right: 4px;
  width: 100%;
}
#units {
  height: 100%;
  margin-top: auto;
}
</style>
