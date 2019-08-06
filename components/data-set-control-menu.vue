<template>
  <Panel class="data-set-control-menu">
    <span class="data-set-control-menu__title h4">Theme Title</span>
    <ul class="data-set-control-menu__list">
      <li
        v-for="(dataset, key) in datasets"
        :key="key"
        class="data-set-control-menu__list-item"
      >
        <label class="data-set-control-menu__label">
          <Icon
            class="data-set-control-menu__icon"
            :name="`dataset-${dataset.id}`"
            fallback-name="placeholder"
          />
          {{ dataset.name }}
          <div class="data-set-control-menu__control">
            <UiToggle
              :checked="dataset.visible"
              class="data-set-control-menu__control"
              @change="toggleLocationDataset(dataset.id)"
            />
            <UiRadio
              :checked="dataset.id === getActiveRasterLayer"
              class="data-set-control-menu__control"
              @change="toggleRasterLayer(dataset.id)"
            />
          </div>
        </label>
      </li>
    </ul>
  </Panel>
</template>

<script>
import { mapGetters } from 'vuex'
import Panel from './panel'
import UiToggle from './ui-toggle'
import UiRadio from './ui-radio'
import Icon from './icon'

export default {
  components: { Panel, UiToggle, Icon, UiRadio },
  props: {
    datasets: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters('map', ['getActiveRasterLayer']),
  },
  methods: {
    toggleLocationDataset(id) {
      this.$emit('toggle-location-dataset', id)
    },
    toggleRasterLayer(id) {
      this.$emit('toggle-raster-layer', id)
    },
  },
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
  height: var(--spacing-large);
  display: flex;
  align-items: center;
}

.data-set-control-menu__label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
}

.data-set-control-menu__icon {
  width: var(--spacing-default);
  height: var(--spacing-default);
  margin-right: var(--spacing-small);
}

.data-set-control-menu__control {
  margin-left: auto;
}
</style>
