<template>
  <div class="time-slider">
    <div v-if="dailyImagesTimeline" />
    <div class="time-slider__button-container">
      <UiButtonIcon class="time-slider__button">
        <Icon class="icons" :mdi="true" name="chevron_left" />
      </UiButtonIcon>
      <span class="time-slider__text">
        {{ activeTimestamp }}
      </span>
      <UiButtonIcon class="time-slider__button">
        <Icon class="icons" :mdi="true" name="chevron_right" />
      </UiButtonIcon>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UiButtonIcon from '../ui-button-icon'
import Icon from '../icon'

export default {
  components: {
    UiButtonIcon, Icon
  },
  props: {
    dailyImagesTimeline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('map', [
      'activeTimestamp'
    ])
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
