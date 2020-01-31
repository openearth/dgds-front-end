<template>
  <div class="time-slider">
    <div v-if="dailyImagesTimeline" />
    <div class="time-slider__button-container">
      <UiButtonIcon class="time-slider__button" @click="getNewRasterLayer(-1)">
        <Icon class="icons" :mdi="true" name="chevron_left" />
      </UiButtonIcon>
      <span class="time-slider__text">
        {{ activeTimestamp }}
      </span>
      <UiButtonIcon class="time-slider__button" @click="getNewRasterLayer(1)">
        <Icon class="icons" :mdi="true" name="chevron_right" />
      </UiButtonIcon>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import UiButtonIcon from '../ui-button-icon'
import Icon from '../icon'

export default {
  components: {
    UiButtonIcon, Icon
  },
  props: {
    dailyImagesTimeline: {
      type: Boolean,
      default: () => false
    },
    dates: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters('map', [
      'activeTimestamp',
      'activeRasterData'
    ])
  },
  methods: {
    ...mapActions('map', ['retrieveRasterLayerByImageId']),
    getNewRasterLayer (newIndex) {
      const series = _.get(this.activeRasterData, 'imageTimeseries')
      const imgId = _.get(this.activeRasterData, 'imageId')

      // Find the index of the current time stamp
      const currentIndex = series.findIndex((serie) => {
        return serie.imageId === imgId
      })
      const serie = series[currentIndex + newIndex]
      const imageId = _.get(serie, 'imageId')
      console.log(serie, series, newIndex, currentIndex, imageId)
      this.retrieveRasterLayerByImageId(imageId)
    }
  }
}
</script>

<style>
.time-slider__button-container {
  display: flex;
}

.time-slider__text {
  margin: auto;
  padding-bottom: 1px;
}
</style>
