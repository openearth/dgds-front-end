<template>
  <div class="layer-legend">
    <svg viewBox="0 0 100 5">
      <defs>
        <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
          <stop
            v-for="(stop, index) in activeRasterLegendData.linearGradient"
            :key="index"
            :offset="stop.offset"
            :style="{
              'stop-color': stop.color,
              'stop-opacity': stop.opacity,
            }"
          />
        </linearGradient>
      </defs>
      <rect width="100" height="10" x="0" y="0" fill="url('#gradient')" />
    </svg>
    <div class="layer-legend__range unselectable">
      <div v-if="!editingRange" class="layer-legend__range-min">
        <ui-button kind="quiet" @click="editRange">{{ minValue }}{{ unit }}</ui-button>
      </div>
      <div v-else class="layer-legend__range-min layer-legend__range-min--editing">
        <ui-text-input
          id="range-min"
          v-model="minValue"
          type="text"
          :label="`Min (${unit})`"
          placeholder="Min value"
        />
      </div>
      <div v-if="!editingRange" class="layer-legend__range-max" @click="editRange">
        <ui-button kind="quiet" @click="editRange">{{ maxValue }}{{ unit }}</ui-button>
      </div>
      <div v-else class="layer-legend__range-max layer-legend__range-max--editing">
        <ui-text-input
          id="range-max"
          v-model="maxValue"
          type="text"
          :label="`Max (${unit})`"
          placeholder="Max value"
        />
      </div>
      <div v-if="editingRange" class="layer-legend__range-buttons">
        <ui-button kind="quiet" @click="editingRange = false">Cancel</ui-button>
        <ui-button kind="secondary" @click="resetRange">Reset</ui-button>
        <ui-button kind="primary" @click="saveRange">Save</ui-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import UiButton from '~/components/ui-button'
  import UiTextInput from '~/components/ui-text-input'

  export default {
    components: { UiButton, UiTextInput },
    props: {
      unit: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        editingRange: false,
        defaultMinValue: '',
        minValue: '',
        defaultMaxValue: '',
        maxValue: '',
      }
    },
    computed: {
      ...mapGetters('map', ['activeRasterData', 'activeRasterLegendData']),
    },
    mounted() {
      const { min, max } = this.activeRasterLegendData
      this.minValue = min.toString()
      this.defaultMinValue = min.toString()
      this.maxValue = max.toString()
      this.defaultMaxValue = max.toString()
    },
    methods: {
      ...mapActions('map', ['retrieveRasterLayerByImageId']),
      editRange() {
        this.editingRange = true
      },
      saveRange() {
        this.editingRange = false

        this.postUpdatedRange()
      },
      resetRange() {
        this.minValue = this.defaultMinValue
        this.maxValue = this.defaultMaxValue
      },
      postUpdatedRange() {
        const { imageId } = this.activeRasterData
        const range = {
          min: this.minValue,
          max: this.maxValue,
        }

        this.retrieveRasterLayerByImageId({ imageId, range })
      },
    },
  }
</script>

<style>
  .layer-legend__range {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
  }

  .layer-legend__range .ui-button {
    padding: 10px;
  }

  .layer-legend__range .ui-button--quiet {
    color: var(--color-text-color);
  }

  .layer-legend__range-min,
  .layer-legend__range-max {
    cursor: pointer;
  }

  .layer-legend__range-min--editing,
  .layer-legend__range-max--editing {
    flex: 0 0 115px;
    max-width: 115px;
    padding: 10px 0 0;
  }

  .layer-legend__range-min--editing .ui-text-input input,
  .layer-legend__range-max--editing .ui-text-input input {
    max-width: 75px;
  }

  .layer-legend__range-max--editing {
    text-align: right;
  }

  .layer-legend__range-buttons {
    display: flex;
    flex: 1 1 100%;
    margin-top: 10px;
  }

  .layer-legend__range-buttons .ui-button--secondary {
    margin-right: 10px;
    margin-left: auto;
  }
</style>
