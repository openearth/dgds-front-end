<template>
  <v-container class="ma-0 pa-0">
    <v-row>
      <v-col cols="9" class="ma-0 pa-0 pl-2">
        <svg viewBox="0 0 100 5">
          <defs>
            <linearGradient :id="`gradient-${datasetId}`" x1="0" x2="1" y1="0" y2="0">
              <stop
                v-for="(stop, index) in linearGradient"
                :key="index"
                :offset="stop.offset"
                :style="{
                  'stop-color': stop.color,
                  'stop-opacity': stop.opacity,
                }"
              />
            </linearGradient>
          </defs>
          <rect :fill="`url(#gradient-${datasetId})`" width="100" height="10" x="0" y="0" />
        </svg>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!editingRange" cols="1" class="ma-0 pa-0">
        <v-btn small plain icon @click="editRange">
          {{ minValue }}
        </v-btn>
      </v-col>
      <v-col v-else cols="4" class="ma-0">
        <v-text-field
          id="range-min"
          v-model="minValue"
          :label="`Min (${unit})`"
          placeholder="Min value"
        ></v-text-field>
      </v-col>
      <v-col v-if="!editingRange" cols="1" offset="6" class="pa-0">
        <v-btn @click="editRange" small plain icon>
          {{ maxValue }}
        </v-btn>
      </v-col>
      <v-col v-else cols="4" class="ma-0">
        <v-text-field
          id="range-max"
          v-model="maxValue"
          :label="`Max (${unit})`"
          placeholder="Max value"
        ></v-text-field>
      </v-col>
      <v-col cols="4" class="my-auto pa-0 unit-text">
        [{{ unit }}]
      </v-col>
    </v-row>
    <v-row v-if="editingRange" justify="space-between">
      <v-col>
        <v-btn dense @click="cancelEditRange">Cancel</v-btn>
      </v-col>
      <v-col>
        <v-btn dense @click="resetRange">Reset</v-btn>
      </v-col>
      <v-col>
        <v-btn dense @click="saveRange">Save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  props: {
    datasetId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      editingRange: false,
      defaultMinValue: '',
      minValue: '',
      defaultMaxValue: '',
      maxValue: '',
      dataset: {},
      unit: '',
      linearGradient: {}
    }
  },
  computed: {
    ...mapGetters(['getDatasets', 'activeRasterData', 'activeRasterLegendData'])
  },
  mounted () {
    this.dataset = this.getDatasets[this.datasetId]
    this.unit = _.get(this.dataset, 'metadata.units')
    this.updateMinMax()
    this.linearGradient = _.get(this.dataset, 'raster.linearGradient')
  },
  methods: {
    ...mapActions(['retrieveRasterLayerByImageId']),
    updateMinMax () {
      const { min, max } = _.get(this.dataset, 'raster')
      this.minValue = min.toString()
      this.maxValue = max.toString()
      this.defaultMinValue = min.toString()
      this.defaultMaxValue = max.toString()
    },
    cancelEditRange () {
      this.minValue = this.defaultMinValue
      this.maxValue = this.defaultMaxValue

      this.editingRange = false
    },
    editRange () {
      this.editingRange = true
    },
    saveRange () {
      this.editingRange = false
      this.postUpdatedRange()
    },
    resetRange () {
      this.minValue = this.defaultMinValue
      this.maxValue = this.defaultMaxValue
    },
    postUpdatedRange () {
      const { imageId } = this.dataset.raster
      const range = {
        min: this.minValue,
        max: this.maxValue
      }
      this.retrieveRasterLayerByImageId({ imageId, options: { min: range.min, max: range.max } })
    }
  }
}
</script>

<style>
.unit-text {
  text-align: center;
}
</style>
